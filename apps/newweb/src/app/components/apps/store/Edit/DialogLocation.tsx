import { Status } from "@/@types/enum/status";
import { LocationInfo } from "@/@types/location-props";
import { Category, Store, StoreRequest } from "@/@types/store-props"
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import BlankCard from "@/app/components/shared/BlankCard";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Chip, Divider, FormHelperText, IconButton, MenuItem, SelectChangeEvent, Tab, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as yup from 'yup';
import Thumbnail from "../../ecommerce/productAdd/Thumbnail";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import { useDropzone } from "react-dropzone";
import { UpdateStoreContext } from "@/app/context/UpdateStoreContext";
import { phoneRegex } from "@/utils/regex";
import { GeoProps } from "@/@types/geo-props";
import useGeoRef from "@/hooks/georef";
import useStoreLocations from "@/hooks/store-locations";
import { Attachment } from "@/@types/product-props";
import { FileInfo } from "@/@types/file-info";
import useStoreProducts from "@/hooks/store-products";
import { formatMeridiem } from "@mui/x-date-pickers/internals";
import { IconX } from "@tabler/icons-react";
import { getLink } from "@/utils/image";


interface DialogLocationProps {
    store: Store,
    location?: LocationInfo | null;
    // categories: Category[];
    state: boolean;
    handleCloseDialog: (refresh?: boolean) => void;
}
const DialogLocation = (props: DialogLocationProps) => {
    const [geos, setGeos] = useState<GeoProps[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [zipCodes, setZipCodes] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [imageDelete, setImageDelete] = useState<string[]>([]);
    const [images, setImages] = useState<Attachment[]>([]);

    const [attachments, setAttachments] = useState<Attachment[]>([]);

    const onChangeStates = (stateName: string) => {
        // form.setFieldValue('state', stateName);
        const geoFilter = geos.filter((geo) => geo.steName == stateName);

        const _zipCodes: string[] = [];
        geoFilter.map((geo) => {
            _zipCodes.push(geo.zipCode);
        });
        const uniqueZipCodes = [...new Set(_zipCodes)];
        // const uniqueZipCodes = [..._zipCodes];
        setZipCodes(uniqueZipCodes);

    }

    const _getGeoRef = async () => {
        const _geos = await getGeoRef();
        setGeos(_geos);
        const _states: string[] = [];
        // const _zips: string[] = [];
        _geos.map((geo) => {
            _states.push(geo.steName);
        });
        const uniqueStates = [...new Set(_states)];
        // const uniqueStates = [..._states];
        setStates(uniqueStates);
        // setAllZipCodes(_zips);
        if (props.location && props.location?.state) {
            const _zipCodes: string[] = [];
            const geoFilter = _geos.filter((geo) => geo.steName == props.location?.state);
            geoFilter.map((geo) => {
                _zipCodes.push(geo.zipCode);
            });
            const uniqueZipCodes = [...new Set(_zipCodes)];
            //const uniqueZipCodes = [..._zipCodes];
            setZipCodes(uniqueZipCodes);
            if (props.location && props.location?.zipCode) {
                const _cities: string[] = [];
                const cityFilter = _geos.filter((geo) => geo.steName == props.location?.state && geo.zipCode == props.location?.zipCode);
                cityFilter.map((geo) => {
                    _cities.push(geo.zipCode);
                });
                const uniqueCities = [...new Set(_cities)];
                setCities(uniqueCities);
            }
        }
    }

    const [openDialog, setOpenDialog] = useState(false);
    const { getGeoRef } = useGeoRef();



    useEffect(() => {
        setOpenDialog(props.state);
        if (props.state) {
            _getGeoRef();
        }


    }, [props.state]);


    useEffect(() => {
        formik.resetForm();
        if (props.location) {

            formik.setFieldValue('addressLine1', props.location.addressLine1);
            formik.setFieldValue('addressLine2', props.location.addressLine2);
            formik.setFieldValue('state', props.location.state);
            formik.setFieldValue('zipCode', props.location.zipCode);
            formik.setFieldValue('city', props.location.city);
            formik.setFieldValue('phone', props.location.phone);
            formik.setFieldValue('fax', props.location.fax);

            formik.setFieldValue('isOpenMon', props.location.isOpenMon);
            formik.setFieldValue('openTimeMon', props.location.openTimeMon);
            formik.setFieldValue('closeTimeMon', props.location.closeTimeMon);

            formik.setFieldValue('isOpenTue', props.location.isOpenTue);
            formik.setFieldValue('openTimeTue', props.location.openTimeTue);
            formik.setFieldValue('closeTimeTue', props.location.closeTimeTue);
            formik.setFieldValue('isOpenWed', props.location.isOpenWed);
            formik.setFieldValue('openTimeWed', props.location.openTimeWed);
            formik.setFieldValue('closeTimeWed', props.location.closeTimeWed);

            formik.setFieldValue('isOpenThu', props.location.isOpenThu);
            formik.setFieldValue('openTimeThu', props.location.openTimeThu);
            formik.setFieldValue('closeTimeThu', props.location.closeTimeThu);

            formik.setFieldValue('isOpenFri', props.location.isOpenFri);
            formik.setFieldValue('openTimeFri', props.location.openTimeFri);
            formik.setFieldValue('closeTimeFri', props.location.closeTimeFri);

            formik.setFieldValue('isOpenSat', props.location.isOpenSat);
            formik.setFieldValue('openTimeSat', props.location.openTimeSat);
            formik.setFieldValue('closeTimeSat', props.location.closeTimeSat);

            formik.setFieldValue('isOpenSun', props.location.isOpenSun);
            formik.setFieldValue('openTimeSun', props.location.openTimeSun);
            formik.setFieldValue('closeTimeSun', props.location.closeTimeSun);

            setAttachments(props.location?.attachments ?? []);

        } else {
            formik.setFieldValue('status', true);
            formik.setFieldValue('isOpenMon', true);
            formik.setFieldValue('openTimeMon', '09:00');
            formik.setFieldValue('closeTimeMon', '17:00');
            formik.setFieldValue('isOpenTue', true);
            formik.setFieldValue('openTimeTue', '09:00');
            formik.setFieldValue('closeTimeTue', '17:00');
            formik.setFieldValue('isOpenWed', true);
            formik.setFieldValue('openTimeWed', '09:00');
            formik.setFieldValue('closeTimeWed', '17:00');
            formik.setFieldValue('isOpenThu', true);
            formik.setFieldValue('openTimeThu', '09:00');
            formik.setFieldValue('closeTimeThu', '17:00');
            formik.setFieldValue('isOpenFri', true);
            formik.setFieldValue('openTimeFri', '09:00');
            formik.setFieldValue('closeTimeFri', '17:00');
            formik.setFieldValue('isOpenSat', true);
            formik.setFieldValue('openTimeSat', '09:00');
            formik.setFieldValue('closeTimeSat', '17:00');
            formik.setFieldValue('isOpenSun', true);
            formik.setFieldValue('openTimeSun', '09:00');
            formik.setFieldValue('closeTimeSun', '17:00');


        }

    }, [props.location])


    const validationSchema = yup.object({
        // ownerstore: yup
        //     .string()
        //     .min(2, 'Too Short!')
        //     .max(50, 'Too Long!')
        //     .required('Store name is Required'),
        // userName: yup
        //     .string()
        //     // .min(8, 'Password should be of minimum 8 characters length')
        //     .required('Password is required'),
        // email: yup.string().email(),
        state: yup.string().trim().required('Required information'),
        zipCode: yup.string().required('Required information'),
        phone: yup.string().matches(phoneRegex, 'Invalid phone').min(1, 'Required information'),
        // openAt: yup.string().trim().min(1, { message: 'Required information' }),
        // closeAt: yup.string().trim().min(1, { message: 'Required information' }),
        // latitude: yup.preprocess(
        //     (value) => (typeof value === 'string' && value ? Number(value) : value),
        //     yup.number()
        // ),
        // longitude: yup.preprocess(
        //     (value) => (typeof value === 'string' && value ? Number(value) : value),
        //     yup.number()
        // ),
        addressLine1: yup.string().max(1000, 'Only 1000 character').required('Required information'),
        addressLine2: yup.string().max(1000, 'Only 1000 character'),
        city: yup.string().max(1000, 'Only 1000 character'),
        // fax: yup.string().regex(phoneRegex, 'Invalid fax').nullable(),
        isOpenMon: yup.boolean(),
        openTimeMon: yup.string().trim().optional(),
        closeTimeMon: yup.string().trim().optional(),

        isOpenTue: yup.boolean(),
        openTimeTue: yup.string().trim().optional(),
        closeTimeTue: yup.string().trim().optional(),

        isOpenWed: yup.boolean(),
        openTimeWed: yup.string().trim().optional(),
        closeTimeWed: yup.string().trim().optional(),

        isOpenThu: yup.boolean(),
        openTimeThu: yup.string().trim().optional(),
        closeTimeThu: yup.string().trim().optional(),


        isOpenFri: yup.boolean(),
        openTimeFri: yup.string().trim().optional(),
        closeTimeFri: yup.string().trim().optional(),

        isOpenSat: yup.boolean(),
        openTimeSat: yup.string().trim().optional(),
        closeTimeSat: yup.string().trim().optional(),

        isOpenSun: yup.boolean(),
        openTimeSun: yup.string().trim().optional(),
        closeTimeSun: yup.string().trim().optional(),
    });

    const formik = useFormik({
        initialValues: {
            no: 0,
            state: '',
            zipCode: '',
            locationID: '',
            address: '',

            openAt: '',
            closeAt: '',
            status: true,
            phone: '',
            attachments: [],

            addressLine1: '',
            addressLine2: '',
            city: '',
            fax: '',
            isOpenMon: true,
            openTimeMon: '',
            closeTimeMon: '',

            isOpenTue: false,
            openTimeTue: '',
            closeTimeTue: '',

            isOpenWed: false,
            openTimeWed: '',
            closeTimeWed: '',

            isOpenThu: false,
            openTimeThu: '',
            closeTimeThu: '',

            isOpenFri: false,
            openTimeFri: '',
            closeTimeFri: '',

            isOpenSat: false,
            openTimeSat: '',
            closeTimeSat: '',

            isOpenSun: false,
            openTimeSun: '',
            closeTimeSun: '',

            latitude: 0,
            longitude: 0,
            images: [],
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (props.location) {
                _updateLocation();
            } else {
                _createLocation();
            }
        },
    });


    const theme = useTheme();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        onDrop: acceptedFiles => {

            formik.setFieldValue("images", acceptedFiles);
            setImages(acceptedFiles.map(file => Object.assign(file, {
                name: file.name,
                url: URL.createObjectURL(file)
            })));


        }
    });
    // const [files, setFiles] = useState<any>([]);

    const thumbServers = attachments.map((file: Attachment, i: number) => (
        <Grid
            size={4}
            key={i}
            position="relative"
        >
            <Box sx={{ position: 'relative', background: 'red', width: '100%', }}>
                <IconButton aria-label="close" onClick={() => {
                    setImageDelete([...imageDelete, file.id!]);
                    attachments.splice(i, 1);
                    setAttachments([...attachments]);
                }} sx={{ position: 'absolute', right: 0, top: 0, width: 30, height: 30 }}>
                    <IconX width={10}></IconX>
                </IconButton>
                {/* <Typography variant="body1" fontWeight="500">
                        {file.name}{" "}
                    </Typography>
                    <Chip color="primary" label={`${file.size} Bytes`} /> */}
                <div style={{ width: '100%', aspectRatio: '1/1' }}>
                    <img
                        src={getLink(file.name)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    // Revoke data uri after image is loaded
                    // onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    />
                </div>
            </Box>
        </Grid>
    ));

    const thumbs = images.map((file: any, i: number) => (
        <Box
            key={i}
            display="flex"
            alignItems="center"
            py={1}
            mt={2}
            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
            justifyContent="space-between"
            position="relative"
        >
            <IconButton aria-label="close" onClick={() => {
                setImageDelete([...imageDelete, file.id!]);
                console.log("index", i);
                images.splice(i, 1);
                setImages([...images]);
            }} sx={{ position: 'absolute', right: 0, top: 0, width: 44, height: 44 }}>
                <IconX width={16}></IconX>
            </IconButton>
            {/* <Typography variant="body1" fontWeight="500">
                {file.name}{" "}
            </Typography>
            <Chip color="primary" label={`${file.size} Bytes`} /> */}
            <div style={{ width: '100%', aspectRatio: '16/9' }}>
                <img
                    src={file.preview}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    // Revoke data uri after image is loaded
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
            </div>
        </Box>
    ));

    const { createLocation, updateLocation, addLocationAttachment } = useStoreLocations();
    const { uploadFile, deleteAttachment } = useStoreProducts();


    const _updateLocation = async () => {
        const geoRefId = geos.find((geo) => geo.steName == formik.values.state && geo.zipCode == formik.values.zipCode);
        if (geoRefId) {
            let images: FileInfo[] = [];
            if (imageDelete) {
                for (const _image of imageDelete) {
                    await deleteAttachment(_image);
                }
            }

            if (formik.values.images && formik.values.images.length > 0) {
                const { data } = await uploadFile(formik.values.images);

                images = [...data];
                const attachments: Attachment[] = images.map((image) => {
                    return {
                        name: image.fileName,
                        url: image.fileName,
                    }
                });
                await addLocationAttachment(props.location?.locationID ?? '', attachments);
            }

            const { result, errorMessage } = await updateLocation(props.store.id, props.location?.locationID ?? '', {
                name: (formik.values.addressLine1 ?? '') + (formik.values.addressLine2 ?? '') + (formik.values.city ?? ''),
                address: (formik.values.addressLine1 ?? '') + (formik.values.addressLine2 ?? '') + (formik.values.city ?? ''),
                openTime: '',
                closeTime: '',
                geoRefId: geoRefId?.id ?? "",
                isActive: formik.values.status,
                phone: formik.values.phone,

                addressLine1: formik.values.addressLine1,
                addressLine2: formik.values.addressLine2,
                city: formik.values.city,
                fax: formik.values.fax,
                isOpenMon: formik.values.isOpenMon,
                openTimeMon: formik.values.openTimeMon,
                closeTimeMon: formik.values.closeTimeMon,

                isOpenTue: formik.values.isOpenTue,
                openTimeTue: formik.values.openTimeTue,
                closeTimeTue: formik.values.closeTimeTue,

                isOpenWed: formik.values.isOpenWed,
                openTimeWed: formik.values.openTimeWed,
                closeTimeWed: formik.values.closeTimeWed,

                isOpenThu: formik.values.isOpenThu,
                openTimeThu: formik.values.openTimeThu,
                closeTimeThu: formik.values.closeTimeThu,

                isOpenFri: formik.values.isOpenFri,
                openTimeFri: formik.values.openTimeFri,
                closeTimeFri: formik.values.closeTimeFri,

                isOpenSat: formik.values.isOpenSat,
                openTimeSat: formik.values.openTimeSat,
                closeTimeSat: formik.values.closeTimeSat,

                isOpenSun: formik.values.isOpenSun,
                openTimeSun: formik.values.openTimeSun,
                closeTimeSun: formik.values.closeTimeSun,
                latitude: formik.values.latitude,
                longitude: formik.values.longitude,
            });

            if (result) {
                // notifications.show({
                //     title: `Success`,
                //     message: `Location have been updated successfully`,
                //     color: 'teal',
                //     icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                //     position: 'top-right'
                // });
                // close(true);
            } else {
                // console.log("errorMessage", errorMessage);
                // notifications.show({
                //     title: `Error`,
                //     message: errorMessage,
                //     color: 'red',
                //     icon: <IconX />,
                //     position: 'top-right'
                // });
            }
        } else {
            formik.setFieldError("state", "geo doesnot exsist");
        }
    }

    const _createLocation = async () => {
        const geoRefId = geos.find((geo) => geo.steName == formik.values.state && geo.zipCode == formik.values.zipCode);
        if (geoRefId) {
            let images: FileInfo[] = [];
            if (formik.values.images) {
                const { data } = await uploadFile(formik.values.images);

                images = [...data];
            }
            const { result, errorMessage } = await createLocation(props.store.id, {
                // name: formik.values.address,
                name: (formik.values.addressLine1 ?? '') + (formik.values.addressLine2 ?? '') + (formik.values.city ?? ''),
                address: (formik.values.addressLine1 ?? '') + (formik.values.addressLine2 ?? '') + (formik.values.city ?? ''),
                openTime: formik.values.openAt,
                closeTime: formik.values.closeAt,
                geoRefId: geoRefId?.id ?? "",
                isActive: formik.values.status,
                phone: formik.values.phone,
                attachments: images.map((image) => {
                    return {
                        name: image.fileName,
                        url: image.fileName,
                    }
                }),
                addressLine1: formik.values.addressLine1,
                addressLine2: formik.values.addressLine2,
                city: formik.values.city,
                fax: formik.values.fax,
                isOpenMon: formik.values.isOpenMon,
                openTimeMon: formik.values.openTimeMon,
                closeTimeMon: formik.values.closeTimeMon,

                isOpenTue: formik.values.isOpenTue,
                openTimeTue: formik.values.openTimeTue,
                closeTimeTue: formik.values.closeTimeTue,

                isOpenWed: formik.values.isOpenWed,
                openTimeWed: formik.values.openTimeWed,
                closeTimeWed: formik.values.closeTimeWed,

                isOpenThu: formik.values.isOpenThu,
                openTimeThu: formik.values.openTimeThu,
                closeTimeThu: formik.values.closeTimeThu,

                isOpenFri: formik.values.isOpenFri,
                openTimeFri: formik.values.openTimeFri,
                closeTimeFri: formik.values.closeTimeFri,

                isOpenSat: formik.values.isOpenSat,
                openTimeSat: formik.values.openTimeSat,
                closeTimeSat: formik.values.closeTimeSat,

                isOpenSun: formik.values.isOpenSun,
                openTimeSun: formik.values.openTimeSun,
                closeTimeSun: formik.values.closeTimeSun,
                latitude: Number(formik.values.latitude) ?? 0,
                longitude: Number(formik.values.longitude) ?? 0,
            });
            if (result) {
                // notifications.show({
                //     title: `Success`,
                //     message: `Location have been created successfully`,
                //     color: 'teal',
                //     icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                //     position: 'top-right'
                // });
                // close(true);
            } else {
                // console.log("errorMessage", errorMessage);
                // notifications.show({
                //     title: `Error`,
                //     message: errorMessage,
                //     color: 'red',
                //     icon: <IconX />,
                //     position: 'top-right'
                // });
            }

        } else {
            formik.setFieldError('state', "Geo donot exsist");
        }

    }

    return <Dialog open={openDialog} onClose={() => props.handleCloseDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{props.location ? 'Edit' : 'Add'} Location</DialogTitle>
        <DialogContent>
            <Grid container rowSpacing={0} spacing={2} mb={4}>
                <Grid size={12} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <Divider></Divider>
                </Grid>
                <Grid size={12} mt={2}>
                    <Grid container spacing={3}>
                        <Grid size={8}>
                            <BlankCard>
                                <Box p={3}>
                                    <Typography variant="h5">General Information</Typography>
                                    <Grid container mt={3} gap={1}>
                                        {/* 1 */}
                                        <Grid display="flex" alignItems="center" size={12}>
                                            <CustomFormLabel htmlFor="addressLine1" sx={{ mt: 0 }}>
                                                Address line 1{" "}
                                                <Typography color="error.main" component="span">
                                                    *
                                                </Typography>
                                            </CustomFormLabel>
                                        </Grid>
                                        <Grid size={12}>
                                            <CustomTextField id="addressLine1"
                                                placeholder="Address line1" fullWidth name="addressLine1"
                                                error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
                                                helpertext={formik.touched.addressLine1 && formik.errors.addressLine1}
                                                value={formik.values.addressLine1}
                                                onChange={formik.handleChange} />
                                        </Grid>
                                        <Grid display="flex" alignItems="center" size={12}>
                                            <CustomFormLabel htmlFor="addressLine2" sx={{ mt: 0 }}>
                                                Address line 2{" "}
                                            </CustomFormLabel>
                                        </Grid>
                                        <Grid size={12}>
                                            <CustomTextField id="addressLine2" placeholder="Address line2" fullWidth
                                                name="addressLine2"
                                                error={formik.touched.addressLine2 && Boolean(formik.errors.addressLine2)}
                                                helpertext={formik.touched.addressLine2 && formik.errors.addressLine2}
                                                value={formik.values.addressLine2}
                                                onChange={formik.handleChange}
                                            />
                                        </Grid>
                                        <Grid size={12} spacing={1} container>
                                            <Grid size={4}>
                                                <CustomFormLabel htmlFor="addressLine1" sx={{ mt: 0 }}>
                                                    State
                                                </CustomFormLabel>
                                                <CustomSelect
                                                    labelId="state"
                                                    id="state"
                                                    name="state"
                                                    value={formik.values.state}
                                                    onChange={(event: SelectChangeEvent) => {
                                                        formik.handleChange(event);
                                                        onChangeStates(event.target.value);

                                                    }}
                                                    error={formik.touched.state && Boolean(formik.errors.state)}
                                                    helpertext={formik.touched.state && formik.errors.state}
                                                    fullWidth
                                                >
                                                    {
                                                        states.map((state, index) => {
                                                            return <MenuItem key={`state_${index}`} value={state}>{state}</MenuItem>
                                                        })
                                                    }
                                                </CustomSelect>
                                                {formik.touched.state && formik.errors.state && (
                                                    <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.state}</FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid size={4}>
                                                <CustomFormLabel htmlFor="addressLine1" sx={{ mt: 0 }}>
                                                    Zipcode
                                                </CustomFormLabel>
                                                <CustomSelect
                                                    labelId="zipCode"
                                                    id="zipCode"
                                                    name="zipCode"
                                                    value={formik.values.zipCode}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                                                    helpertext={formik.touched.zipCode && formik.errors.zipCode}
                                                    fullWidth
                                                >
                                                    {
                                                        zipCodes.map((zipCode, index) => {
                                                            return <MenuItem key={`zip_${index}`} value={zipCode}>{zipCode}</MenuItem>
                                                        })
                                                    }
                                                </CustomSelect>
                                                {formik.touched.zipCode && formik.errors.zipCode && (
                                                    <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.zipCode}</FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid size={4}>
                                                <CustomFormLabel htmlFor='city' sx={{ mt: 0 }}>City</CustomFormLabel>
                                                {/* <CustomTextField id="city" placeholder="City" fullWidth /> */}
                                                <CustomSelect
                                                    labelId="city"
                                                    id="city"
                                                    name="city"
                                                    value={formik.values.city}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                                    helpertext={formik.touched.city && formik.errors.city}
                                                    fullWidth
                                                >
                                                    {
                                                        cities.map((city, index) => {
                                                            return <MenuItem key={`city_${index}`} value={city}>{city}</MenuItem>
                                                        })
                                                    }
                                                </CustomSelect>
                                                {formik.touched.city && formik.errors.city && (
                                                    <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.city}</FormHelperText>
                                                )}
                                            </Grid>
                                        </Grid>
                                        <Grid size={12} spacing={1} container>
                                            <Grid size={6}>
                                                <CustomFormLabel htmlFor="phone" sx={{ mt: 0 }}>
                                                    Phone{" "}
                                                    <Typography color="error.main" component="span">
                                                        *
                                                    </Typography>
                                                </CustomFormLabel>
                                                <CustomTextField id="phone" placeholder="Phone" fullWidth name="phone"
                                                    value={formik.values.phone}
                                                    onChange={formik.handleChange} />
                                            </Grid>
                                            <Grid size={6}>
                                                <CustomFormLabel htmlFor="fax" sx={{ mt: 0 }}>
                                                    Fax{" "}
                                                    <Typography color="error.main" component="span">
                                                        *
                                                    </Typography>
                                                </CustomFormLabel>
                                                <CustomTextField id="fax" placeholder="Fax" fullWidth name="fax" value={formik.values.fax}
                                                    onChange={formik.handleChange} />
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Box>
                            </BlankCard>
                            <Box p={1}>
                            </Box>
                            <BlankCard sx={{ marginTop: 2 }}>
                                <Box p={3} gap={2}>
                                    <Typography variant="h5">Open Time</Typography>
                                    <Grid size={12} display="flex" alignItems="center" gap={2} mt={1}>
                                        <CustomFormLabel htmlFor='Name' sx={{ marginTop: '0px', width: '100px' }}>Mon</CustomFormLabel>
                                        <CustomCheckbox name="isOpenMon" value={formik.values.isOpenMon} checked={formik.values.isOpenMon}
                                            onChange={formik.handleChange} />

                                        <CustomTextField id="openTimeMon" placeholder="" fullWidth type="time"
                                            name="openTimeMon" value={formik.values.openTimeMon}
                                            onChange={formik.handleChange}
                                        />
                                        <CustomTextField id="closeTimeMon" placeholder="" fullWidth type="time"
                                            name="closeTimeMon" value={formik.values.closeTimeMon}
                                            onChange={formik.handleChange}
                                        />
                                    </Grid>
                                    <Grid size={12} display="flex" alignItems="center" gap={2} mt={2}>
                                        <CustomFormLabel htmlFor='Name' sx={{ marginTop: '0px', width: '100px' }}>Tue</CustomFormLabel>
                                        <CustomCheckbox name="isOpenTue" value={formik.values.isOpenTue} checked={formik.values.isOpenTue}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="openTimeTue" placeholder="" fullWidth type="time"
                                            name="openTimeTue" value={formik.values.openTimeTue}
                                            onChange={formik.handleChange}
                                        />
                                        <CustomTextField id="closeTimeTue" placeholder="" fullWidth type="time"
                                            name="closeTimeTue" value={formik.values.closeTimeTue}
                                            onChange={formik.handleChange} />
                                    </Grid>
                                    <Grid size={12} display="flex" alignItems="center" gap={2} mt={2}>
                                        <CustomFormLabel htmlFor='Name' sx={{ marginTop: '5px', width: '100px' }} >Wed</CustomFormLabel>
                                        <CustomCheckbox name="isOpenWed" value={formik.values.isOpenWed} checked={formik.values.isOpenWed}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="openTimeWed" placeholder="" fullWidth type="time" name="openTimeWed" value={formik.values.openTimeWed}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="closeTimeWed" placeholder="" fullWidth type="time" name="closeTimeWed" value={formik.values.closeTimeWed}
                                            onChange={formik.handleChange} />
                                    </Grid>
                                    <Grid size={12} display="flex" alignItems="center" gap={2} mt={2}>
                                        <CustomFormLabel htmlFor='Name' sx={{ marginTop: '5px', width: '100px' }}>Thu</CustomFormLabel>
                                        <CustomCheckbox name="isOpenThu" value={formik.values.isOpenThu} checked={formik.values.isOpenThu}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="openTimeThu" placeholder="" fullWidth type="time" name="openTimeThu" value={formik.values.openTimeThu}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="closeTimeThu" placeholder="" fullWidth type="time" name="closeTimeThu" value={formik.values.closeTimeThu}
                                            onChange={formik.handleChange} />
                                    </Grid>
                                    <Grid size={12} display="flex" alignItems="center" gap={2} mt={2}>
                                        <CustomFormLabel htmlFor='Name' sx={{ marginTop: '5px', width: '100px' }}>Fri</CustomFormLabel>
                                        <CustomCheckbox name="isOpenFri" value={formik.values.isOpenFri} checked={formik.values.isOpenFri}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="openTimeFri" placeholder="" fullWidth type="time" name="openTimeFri" value={formik.values.openTimeFri}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="closeTimeFri" placeholder="" fullWidth type="time" name="closeTimeFri" value={formik.values.closeTimeFri}
                                            onChange={formik.handleChange} />
                                    </Grid>
                                    <Grid size={12} display="flex" alignItems="center" gap={2} mt={2}>
                                        <CustomFormLabel htmlFor='Name' sx={{ marginTop: '5px', width: '100px' }}>Sat</CustomFormLabel>
                                        <CustomCheckbox name="isOpenSat" value={formik.values.isOpenSat} checked={formik.values.isOpenSat}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="openTimeSat" placeholder="" fullWidth type="time" name="openTimeSat" value={formik.values.openTimeSat}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="closeTimeSat" placeholder="" fullWidth type="time" name="closeTimeSat" value={formik.values.closeTimeSat}
                                            onChange={formik.handleChange} />
                                    </Grid>
                                    <Grid size={12} display="flex" alignItems="center" gap={2} mt={2}>
                                        <CustomFormLabel htmlFor='Name' sx={{ marginTop: '5px', width: '100px' }}>Sun</CustomFormLabel>
                                        <CustomCheckbox name="isOpenSun" value={formik.values.isOpenSun} checked={formik.values.isOpenSun}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="openTimeSun" placeholder="" fullWidth type="time" name="openTimeSun" value={formik.values.openTimeSun}
                                            onChange={formik.handleChange} />
                                        <CustomTextField id="closeTimeSun" placeholder="" fullWidth type="time" name="closeTimeSun" value={formik.values.closeTimeSun}
                                            onChange={formik.handleChange} />
                                    </Grid>
                                </Box>
                            </BlankCard>
                        </Grid>
                        <Grid size={4} rowGap={2}>
                            <BlankCard>
                                <Box p={3}>
                                    <Typography variant="h5">Thumnail</Typography>
                                    <Box
                                        mt={3}
                                        fontSize="12px"
                                        sx={{
                                            backgroundColor: "primary.light",
                                            color: "primary.main",
                                            padding: "30px",
                                            textAlign: "center",
                                            border: `1px dashed`,
                                            borderColor: "primary.main",
                                        }}
                                        {...getRootProps({ className: "dropzone" })}
                                    >
                                        <input {...getInputProps()} />
                                        <p>Drag &apos;n&apos;  drop some files here, or click to select files</p>
                                    </Box>
                                    <Typography variant="body2" textAlign="center" mt={1}>
                                        Set the product thumbnail image. Only *.png, *.jpg and *.jpeg image
                                        files are accepted.
                                    </Typography>
                                    <Box mt={2}>
                                        <Typography variant="h6" fontSize="15px">
                                            Files
                                        </Typography>
                                        <Grid container size={12} spacing={1}> {thumbServers}</Grid>
                                        <Typography variant="body1">{thumbs}</Typography>
                                        {/* <Typography variant="body1">{fileServer}</Typography> */}
                                    </Box>
                                </Box>
                            </BlankCard>
                            <Box p={1}>
                            </Box>
                            <BlankCard>
                                <Box p={3}>
                                    <Typography variant="h5">Status</Typography>
                                    {/* <CustomSwitch checked={status} onChange={handleChangeStatus} sx={{ marginLeft: 0 }} /> */}
                                    <CustomSwitch name="status" checked={formik.values.status} onChange={formik.handleChange} sx={{ marginLeft: 0 }} />
                                </Box>
                            </BlankCard>
                        </Grid>
                    </Grid >
                </Grid>
            </Grid>
        </DialogContent >
        <DialogActions>
            <Button color="primary"
                variant="outlined" onClick={() => props.handleCloseDialog(false)}>
                Cancel
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    formik.submitForm();
                    // props.handleCloseDialog
                }}
            >
                Save
            </Button>
        </DialogActions>
    </Dialog >
}

export default DialogLocation;





