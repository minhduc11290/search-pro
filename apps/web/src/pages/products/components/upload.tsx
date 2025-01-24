import { Button, Container, Group, Modal, rem, Title, Text, List, Progress } from "@mantine/core";
import { CreateProductProps } from "../../../@types/create-product-props";
import { Dropzone, MS_EXCEL_MIME_TYPE } from "@mantine/dropzone";
import { useEffect, useRef, useState } from "react";
import { IconCheck, IconPhoto } from "@tabler/icons-react";
import readXlsxFile from 'read-excel-file'
import { useLocation } from "react-router-dom";
import useStoreLocations from "../../../hooks/store-locations";
import { LocationInfo } from "../../../@types/location-props";
import useStoreProducts from "../../../hooks/store-products";
import { notifications } from "@mantine/notifications";

// const ImportProductPage = ({ opened, close }: CreateProductProps) => {
const ImportProductPage = ({ opened, close }: CreateProductProps) => {

    const openRef = useRef<() => void>(null);
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [value, setValue] = useState(0);
    const { getStoreLocations } = useStoreLocations();
    const location = useLocation();
    const storeId = location.state.id;
    const [locationsDB, setLocationsDB] = useState<LocationInfo[]>([]);
    // const schema = {
    //     // 'ProductName': {
    //     //     // JSON object property name.
    //     //     prop: 'name',
    //     //     type: string
    //     // },
    //     // 'Description': {
    //     //     // JSON object property name.
    //     //     prop: 'description',
    //     //     type: string
    //     // },
    //     // 'Keyword': {
    //     //     // JSON object property name.
    //     //     prop: 'keywords',
    //     //     type: string
    //     // },
    //     // 'SKU': {
    //     //     // JSON object property name.
    //     //     prop: 'sku',
    //     //     type: string
    //     // },
    // };
    const { createProduct } = useStoreProducts();
    const init = async () => {
        const _locations = await getStoreLocations(storeId);
        setLocationsDB(_locations);

    }

    useEffect(() => { init();
        if(opened) {
            setFileName("");
            setFile(null); 
            setValue(0);
        }
     }, [opened])

    const [error, setError] = useState("");
    const handleSubmit = async () => {
        setError("");
        if (file) {
            const rows = await readXlsxFile(file);
            console.log("rows", rows);
            setValue(20);
            let hasErrors = false;

            const itemPercent = 40 / rows.length;
            rows.map((row, index) => {
                if (index != 0) {
                    if (row.length < 4) {
                        console.log("excel-col-length:", row.length);
                        hasErrors = true;
                    }
                    if (row.length > (4 + locationsDB.length)) {
                        console.log("excel-error-num-column1:", row.length);
                        console.log("excel-error-num-column2:", (4 + locationsDB.length));
                        hasErrors = true;
                    }
                    locationsDB.map((_, index) => {
                        if ((row[4 + index] ?? "") != "" && typeof (row[4 + index]) != "number") {
                            console.log("excel-error-column", index);
                            console.log("excel-error-column", index);
                            hasErrors = true;
                        }
                    });

                    if ((row[0] ?? "").toString().trim() == "") {
                        console.log("excel-error-required");
                        hasErrors = true;
                    }

                }
                setValue(20 + (itemPercent * (index + 1)));
            });

            if (hasErrors) {
                setValue(100);
                setError("wrong format");
                return;
            }

            let _errorMessage = "";
            let index =0;
            for (const row of rows) {

            // rows.map(async (row, index) => {
                if (index != 0) {
                    const productLocations: { locationId: string, price: number }[] = [];
                    locationsDB.map((location, index) => {
                        if ((row[4 + index] ?? "").toString().trim() != "") {
                            productLocations.push({
                                locationId: location.locationID,
                                price: Number(row[4 + index])
                            });
                        }
                    })

                    const { errorMessage } = await createProduct(storeId, {
                        sku: (row[3] ?? "").toString(),
                        name: (row[0] ?? "").toString(),
                        keywords: (row[2] ?? "").toString().split(","),
                        description: (row[1] ?? "").toString(),
                        productLocations: productLocations,
                        attachments: [],
                        isActive: true
                    });

                    if (errorMessage) {
                        _errorMessage += `row ${index}:  ${errorMessage} ,`
                    }
                }

                setValue(60 + (itemPercent * (index + 1)));
                // });
                index++;
            }

            if (_errorMessage) {
                setValue(100);
                setError(_errorMessage);
                return;
            } else {
                setValue(100);
                notifications.show({
                    title: `Success`,
                    message: `Product have been created successfully`,
                    color: 'teal',
                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                    position: 'top-right'
                });
                close(true);
            }




        }

    }
    return <Modal opened={opened} onClose={() => close} size="lg" centered withCloseButton={false}>
        <Title className="font-bold text-xl"> Import product list </Title>
        <Container className="h-[270px] w-full border border-dashed mt-2 flex flex-col">
            <Dropzone openRef={openRef} className="flex-1" onDrop={(files) => {
                console.log('onDrop files', files);
                setFileName(files[0].name);
                setFile(files[0]);
            }}
                onReject={(files) => console.log('rejected files', files)}
                maxSize={5 * 1024 ** 2}
                accept={MS_EXCEL_MIME_TYPE}>
                {/* children */}
                <Container className="w-full h-32 flex-1 flex items-center justify-center ">
                    <Group justify="center" style={{ pointerEvents: 'none' }}>
                        <Dropzone.Idle>
                            <Group justify="center" mt="md" className="flex flex-row w-full">
                                <IconPhoto
                                    style={{ width: rem(20), height: rem(20), color: 'var(--mantine-color-dimmed)' }}
                                    stroke={1.5}
                                />
                                <Text>
                                    Drag your file here or
                                </Text>
                            </Group>
                            <Group justify="center" mt="md">
                                <Button onClick={() => openRef.current?.()}>Select files</Button>
                            </Group>

                        </Dropzone.Idle>
                    </Group>
                </Container>
            </Dropzone>
            <Text>{fileName}</Text>
            {file && <Progress value={value} size="lg" transitionDuration={200} />}
            <List listStyleType="disc">
                <List.Item>Get the import template here.</List.Item>
                <List.Item>You can upload only one file at a time.</List.Item>
                <List.Item>File type: .xls, .xlsx</List.Item>
                <List.Item>Maximum file size: 5MB.</List.Item>
            </List>


        </Container>
        {error && <Text className="text-red-400">{error}</Text>}
        <Group mt="xl" className="flex justify-end">
            <Button variant="default" onClick={() => close(false)}>Close</Button>
            <Button disabled={fileName == ""} onClick={handleSubmit}>Upload</Button>
        </Group>

    </Modal >
}

export default ImportProductPage;