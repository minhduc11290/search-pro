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
import { Autocomplete, Box, Checkbox, Chip, Divider, Fab, FormHelperText, IconButton, MenuItem, Select, SelectChangeEvent, Switch, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import { FormikErrors, useFormik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
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
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { getLink } from "@/utils/image";
import toast from "react-hot-toast";
import { SearchableCities } from "@/@types/searchable-cities";
import { LocationSearchableRequest } from "@/@types/location-searchable-props";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// delete (L.Icon.Default.prototype as any)._getIconUrl;

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

interface DialogLocationProps {
    store: Store,
    location?: LocationInfo | null;
    categories: Category[];
    state: boolean;

    handleCloseDialog: (refresh?: Boolean) => void;
}

interface FormValues {
    no: number;
    state: string;
    zipCode: string;
    locationID: string;
    address: string;
    openAt: string;
    closeAt: string;
    status: boolean;
    phone: string;
    attachments: any[]; // Có thể thay thế bằng kiểu cụ thể hơn nếu cần
    addressLine1: string;
    addressLine2: string;
    city: string;
    fax: string;
    isOpenMon: boolean;
    openTimeMon: string;
    closeTimeMon: string;
    isOpenTue: boolean;
    openTimeTue: string;
    closeTimeTue: string;
    isOpenWed: boolean;
    openTimeWed: string;
    closeTimeWed: string;
    isOpenThu: boolean;
    openTimeThu: string;
    closeTimeThu: string;
    isOpenFri: boolean;
    openTimeFri: string;
    closeTimeFri: string;
    isOpenSat: boolean;
    openTimeSat: string;
    closeTimeSat: string;
    isOpenSun: boolean;
    openTimeSun: string;
    closeTimeSun: string;
    latitude: number;
    longitude: number;
    images: any[]; // Có thể thay đổi tùy theo kiểu dữ liệu hình ảnh
    cities: SearchableCities[];
}

const DialogLocation = (props: DialogLocationProps) => {

    const customIcon = new L.Icon({
        iconUrl: '/leaflet/marker-icon.png',
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        shadowUrl: '/leaflet/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

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

    const onChangeZipCode = (zipCode: string) => {
        // form.setFieldValue('state', stateName);
        const geoFilter = geos.filter((geo) => geo.steName == formik.values.state && geo.zipCode == zipCode);

        const _cities: string[] = [];
        geoFilter.map((geo) => {
            _cities.push(geo.city);
        });
        const uniqueCities = [...new Set(_cities)];
        // const uniqueZipCodes = [..._zipCodes];
        setCities(uniqueCities);

    }
    const [allCities, setAllCities] = useState<string[]>([]);

    const _getGeoRef = async () => {
        const _geos = await getGeoRef();
        setGeos(_geos);
        const _states: string[] = [];
        const _allCities: string[] = [];
        // const _zips: string[] = [];
        _geos.map((geo) => {
            _states.push(geo.steName);
            _allCities.push(geo.city);
        });
        const uniqueCities = [...new Set(_allCities)];
        setAllCities(uniqueCities);

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
                    _cities.push(geo.city);
                });
                const uniqueCities = [...new Set(_cities)];
                setCities(uniqueCities);
            }
        }
    }

    const [openDialog, setOpenDialog] = useState(false);
    const { getGeoRef } = useGeoRef();

    useEffect(() => {
        // if (!props.state) {
        //     formik.resetForm();
        // }
        setImages([]);
        setOpenDialog(props.state);
        console.log("debug-init", props.state)
        if (props.state) {
            _getData();
        }





    }, [props.state]);

    const _getData = async () => {
        await _getGeoRef();

    }

    useEffect(() => {
        if (geos.length > 0 && props.state) {
            _getLocationSearchable();
        }
    }, [
        geos, props.state
    ])


    useEffect(() => {
        console.log("debug-props.location", props.location)
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

            formik.setFieldValue('cities', props.location.cities);
            setAttachments(props.location?.attachments ?? []);

        } else {
            formik.resetForm();
            formik.setFieldValue('status', true);
            formik.setFieldValue('isOpenMon', true);
            formik.setFieldValue('openTimeMon', '08:00');
            formik.setFieldValue('closeTimeMon', '17:00');
            formik.setFieldValue('isOpenTue', true);
            formik.setFieldValue('openTimeTue', '08:00');
            formik.setFieldValue('closeTimeTue', '17:00');
            formik.setFieldValue('isOpenWed', true);
            formik.setFieldValue('openTimeWed', '08:00');
            formik.setFieldValue('closeTimeWed', '17:00');
            formik.setFieldValue('isOpenThu', true);
            formik.setFieldValue('openTimeThu', '08:00');
            formik.setFieldValue('closeTimeThu', '17:00');
            formik.setFieldValue('isOpenFri', true);
            formik.setFieldValue('openTimeFri', '08:00');
            formik.setFieldValue('closeTimeFri', '17:00');
            formik.setFieldValue('isOpenSat', true);
            formik.setFieldValue('openTimeSat', '08:00');
            formik.setFieldValue('closeTimeSat', '16:00');
            formik.setFieldValue('isOpenSun', false);
            formik.setFieldValue('openTimeSun', '');
            formik.setFieldValue('closeTimeSun', '');
        }

    }, [props.state])

    const _getLocationSearchable = async () => {
        const _locationSearchable = await getStoreLocationSearchable(props.store.id);
        await formik.setFieldValue("cities", _locationSearchable);
        console.log("debug-cities-_locationSearchable", _locationSearchable)
        _locationSearchable.forEach(async (city, index) => {
            console.log("debug-cities-city", city);


            await formik.setFieldValue(`cities.${index}.state`, city.state);

            await formik.setFieldValue(`cities.${index}.city`, city.city);
            await onChangeStatesSearch(index, city.state);
        })
        // onChangeStatesSearch();
    }

    const _addLocationSearchable = async (location: LocationSearchableRequest) => {
        // formik.values.cities.map((city, index) => {
        //     state: city.state,
        //         cities: city.city,
        // })
        // locations.map(async (location, index) => {
        //     await createLocationSearchable(props.store.id, location);
        // });
        await createLocationSearchable(props.store.id, location);
    }

    const _updateLocationSearchable = async (locationId: string, location: LocationSearchableRequest) => {
        await updateLocationSearchable(props.store.id, locationId, location);
    }

    const _deleteLocationSearchable = async (locationId: string) => {
        await deleteLocationSearchable(props.store.id, locationId);
    }


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
        city: yup.string().max(1000, 'Only 1000 character').required('Required information'),
        // fax: yup.string().regex(phoneRegex, 'Invalid fax').nullable(),
        isOpenMon: yup.boolean(),
        // openTimeMon: yup.string().trim().optional(),
        // closeTimeMon: yup.string().trim().optional(),
        openTimeMon: yup.string().when("isOpenMon", {
            is: true,
            then: (schema) => schema.required("Required information"),
            otherwise: (schema) => schema.notRequired(),
        }),
        closeTimeMon: yup.string().when("isOpenMon", {
            is: true,
            then: (schema) =>
                schema
                    .required("Required information")
                    .test("is-after-openTime", "Closing hours must be after opening", function (closeTime) {
                        const { openTimeMon } = this.parent;
                        return openTimeMon && closeTime ? closeTime > openTimeMon : true;
                    }),
            otherwise: (schema) => schema.notRequired(),
        }),

        isOpenTue: yup.boolean(),
        openTimeTue: yup.string().when("isOpenTue", {
            is: true,
            then: (schema) => schema.required("Required information"),
            otherwise: (schema) => schema.notRequired(),
        }),
        closeTimeTue: yup.string().when("isOpenTue", {
            is: true,
            then: (schema) =>
                schema
                    .required("Required information")
                    .test("is-after-openTime", "Closing hours must be after opening", function (closeTime) {
                        const { openTimeTue } = this.parent;
                        return openTimeTue && closeTime ? closeTime > openTimeTue : true;
                    }),
            otherwise: (schema) => schema.notRequired(),
        }),

        isOpenWed: yup.boolean(),
        openTimeWed: yup.string().when("isOpenWed", {
            is: true,
            then: (schema) => schema.required("Required information"),
            otherwise: (schema) => schema.notRequired(),
        }),
        closeTimeWed: yup.string().when("isOpenWed", {
            is: true,
            then: (schema) =>
                schema
                    .required("Required information")
                    .test("is-after-openTime", "Closing hours must be after opening", function (closeTime) {
                        const { openTimeWed } = this.parent;
                        return openTimeWed && closeTime ? closeTime > openTimeWed : true;
                    }),
            otherwise: (schema) => schema.notRequired(),
        }),

        isOpenThu: yup.boolean(),
        openTimeThu: yup.string().when("isOpenThu", {
            is: true,
            then: (schema) => schema.required("Required information"),
            otherwise: (schema) => schema.notRequired(),
        }),
        closeTimeThu: yup.string().when("isOpenThu", {
            is: true,
            then: (schema) =>
                schema
                    .required("Required information")
                    .test("is-after-openTime", "Closing hours must be after opening", function (closeTime) {
                        const { openTimeThu } = this.parent;
                        return openTimeThu && closeTime ? closeTime > openTimeThu : true;
                    }),
            otherwise: (schema) => schema.notRequired(),
        }),


        isOpenFri: yup.boolean(),
        openTimeFri: yup.string().when("isOpenFri", {
            is: true,
            then: (schema) => schema.required("Required information"),
            otherwise: (schema) => schema.notRequired(),
        }),
        closeTimeFri: yup.string().when("isOpenFri", {
            is: true,
            then: (schema) =>
                schema
                    .required("Required information")
                    .test("is-after-openTime", "Closing hours must be after opening", function (closeTime) {
                        const { openTimeFri } = this.parent;
                        return openTimeFri && closeTime ? closeTime > openTimeFri : true;
                    }),
            otherwise: (schema) => schema.notRequired(),
        }),

        isOpenSat: yup.boolean(),
        openTimeSat: yup.string().when("isOpenSat", {
            is: true,
            then: (schema) => schema.required("Required information"),
            otherwise: (schema) => schema.notRequired(),
        }),
        closeTimeSat: yup.string().when("isOpenSat", {
            is: true,
            then: (schema) =>
                schema
                    .required("Required information")
                    .test("is-after-openTime", "Closing hours must be after opening", function (closeTime) {
                        const { openTimeSat } = this.parent;
                        return openTimeSat && closeTime ? closeTime > openTimeSat : true;
                    }),
            otherwise: (schema) => schema.notRequired(),
        }),

        isOpenSun: yup.boolean(),
        openTimeSun: yup.string().when("isOpenSun", {
            is: true,
            then: (schema) => schema.required("Required information"),
            otherwise: (schema) => schema.notRequired(),
        }),
        closeTimeSun: yup.string().when("isOpenSun", {
            is: true,
            then: (schema) =>
                schema
                    .required("Required information")
                    .test("is-after-openTime", "Closing hours must be after opening", function (closeTime) {
                        const { openTimeSat } = this.parent;
                        return openTimeSat && closeTime ? closeTime > openTimeSat : true;
                    }),
            otherwise: (schema) => schema.notRequired(),
        }),
    });
    const [pressed, setPressed] = useState(false);
    const formik = useFormik<FormValues>({
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
            cities: [],
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setPressed(true);
            if (props.location) {
                await _updateLocation();
            } else {
                await _createLocation();
            }
            setPressed(false);
        },
    });


    const theme = useTheme();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        onDrop: acceptedFiles => {

            // formik.setFieldValue("images", acceptedFiles);
            // setImages(acceptedFiles.map(file => Object.assign(file, {
            //     name: file.name,
            //     url: URL.createObjectURL(file)
            // })));
            const newFiles = acceptedFiles.map(file => {
                return {
                    name: file.name,
                    url: URL.createObjectURL(file)
                }
            });

            const formFiles = [...formik.values.images, ...acceptedFiles].slice(0, 1);
            formik.setFieldValue("images", formFiles);

            const _images = [...images, ...newFiles].slice(0, 1);

            // formik.setFieldValue("images", acceptedFiles);

            setImages(_images);


        }
    });
    // const [files, setFiles] = useState<any>([]);

    const thumbServers = attachments.map((file: Attachment, i: number) => (
        <Grid
            size={12}
            key={i}
            position="relative"
        >
            <Box sx={{ position: 'relative', width: '100%', }}>
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
                <div style={{ width: '100%', aspectRatio: '16/9' }}>
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
                    src={file.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    // Revoke data uri after image is loaded
                    onLoad={() => { URL.revokeObjectURL(file.url) }}
                />
            </div>
        </Box>
    ));

    const { createLocation, updateLocation, addLocationAttachment, getStoreLocationSearchable, createLocationSearchable, updateLocationSearchable, deleteLocationSearchable } = useStoreLocations();
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

            if (formik.values.cities) {
                let addSearchableCities = formik.values.cities.filter((item) => item.type == 'ADD');
                let updateSearchableCities = formik.values.cities.filter((item) => item.type != 'ADD');
                addSearchableCities.map(async (city) => {
                    await _addLocationSearchable({
                        state: city.state,
                        cities: city.city ?? []
                    })
                });

                updateSearchableCities.map(async (city) => {
                    if (city.id) {
                        await _updateLocationSearchable(city.id, {
                            state: city.state,
                            cities: city.city ?? []
                        })
                    }
                });
            }

            if (deleteSearchableCities) {
                deleteSearchableCities.map(async (city) => {
                    await _deleteLocationSearchable(city);
                });
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
                fax: formik.values.fax ?? "",
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
                attachments: [],
                cities: formik.values.cities,
            });

            if (result) {
                toast.success("Location have been updated successfully");
                props.handleCloseDialog(true);
                // notifications.show({
                //     title: `Success`,
                //     message: `Location have been updated successfully`,
                //     color: 'teal',
                //     icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                //     position: 'top-right'
                // });
                // close(true);
            } else {
                toast.error(errorMessage);
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

            if (formik.values.cities) {
                formik.values.cities.map(async (city, index) => {
                    _addLocationSearchable({
                        state: city.state,
                        cities: city.city ?? []
                    })
                });
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
                cities: formik.values.cities,
            });
            if (result) {
                toast.success("Location have been created successfully")
                // notifications.show({
                //     title: `Success`,
                //     message: `Location have been created successfully`,
                //     color: 'teal',
                //     icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                //     position: 'top-right'
                // });
                // close(true);
                props.handleCloseDialog(true);
            } else {
                toast.error(errorMessage);
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

    const [selectAll, setSelectAll] = useState(false);
    const toggleSelectAll = () => {
        const selectAllValue = !selectAll;
        setSelectAll(selectAllValue);
        // if (selectAllValue) {
        //   setSelectedProducts(invoices.map((invoice: { id: any }) => invoice.id));
        // } else {
        //   setSelectedProducts([]);
        // }
    };

    const onChangeStatesSearch = async (index: number, state: string) => {
        console.log("debug-cities-state", state);
        console.log("debug-cities-geos", geos);
        const geoFilter = geos.filter((geo) => geo.steName == state);
        const _cities: string[] = [];
        geoFilter.map((geo) => {
            _cities.push(geo.city);
        });

        const uniqueCities = ["All", ...new Set(_cities)];
        setCities(uniqueCities);
        console.log("debug-cities-onChangeStatesSearch", uniqueCities);

        await formik.setFieldValue(`cities.${index}.cities`, uniqueCities);
        await formik.setFieldValue(`cities.${index}.optionCities`, [...new Set(_cities)]);
    }

    const addCities = () => {
        const _cities: SearchableCities[] = formik.values.cities;
        _cities.push({
            city: [],
            state: '',
            type: 'ADD'
        });
        formik.setFieldValue("cities", _cities);
    };

    const handleCityChange = (index: number, cities: string[]) => {
        formik.setFieldValue(`cities.${index}.city`, cities);
    }


    const autocompleteRef = useRef<HTMLDivElement>(null);
    const [deleteSearchableCities, setDeleteSearchableCities] = useState<string[]>([]);
    const deleteRow = (index: number) => {
        if (formik.values.cities[index].id) {
            setDeleteSearchableCities([...deleteSearchableCities, formik.values.cities[index].id])
        }
        let cities = formik.values.cities;
        cities.splice(index, 1);
        formik.setFieldValue("cities", cities);
    }
    const [valueTab, setValueTab] = useState('1');

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setValueTab(newValue);
    };
    return <Dialog open={openDialog} onClose={() => { props.handleCloseDialog(false); formik.resetForm(); }
    } maxWidth="lg" fullWidth>
        <Box flex="1" display="flex" alignItems="center" justifyContent="space-between">
            <DialogTitle>{props.location ? 'Edit' : 'Add'} Location</DialogTitle>
            <Box paddingRight={3} display="flex">
                <Button color="primary"
                    variant="outlined" onClick={() => {
                        props.handleCloseDialog(false);
                        formik.resetForm()
                    }}>
                    Cancel
                </Button>
                <Box p={1}></Box>
                <Button
                    disabled={pressed}
                    variant="contained"
                    onClick={() => {
                        formik.submitForm();
                        // props.handleCloseDialog
                    }}
                >
                    Save
                </Button>
            </Box>
        </Box>
        <DialogContent sx={{ paddingTop: 0 }}>
            <TabContext value={valueTab} >
                <Box sx={{ borderBottom: 1, borderColor: (theme: any) => theme.palette.divider }}>
                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                        <Tab label="General Information" value="1" />
                        <Tab label="City Searchable" value="2" />
                        {props.location && <Tab label="Location Information" value="3" />}
                    </TabList>
                </Box>
                <Box sx={{ height: '526px', overflow: 'hidden' }}>
                    <TabPanel value="1" sx={{ height: '100%', overflowY: 'auto' }}>
                        <Grid container size={12} alignItems="strech">
                            <Box sx={{ width: '100%' }} display="flex" flexDirection="row" flex="1">
                                <Box width="40%" alignItems="strech" paddingRight={1}  >
                                    <BlankCard sx={{ height: '100%' }} height="100%">
                                        <Box p={1}>
                                            <Box display="flex" flex="1" justifyContent="space-between" flexDirection="row">
                                                <Typography variant="h5">Contact & Address</Typography>
                                                <Switch color="success" name="status" checked={formik.values.status} onChange={formik.handleChange} sx={{ marginLeft: 0 }} />
                                            </Box>
                                            <Grid container mt={1} gap={1}>
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
                                                    <Grid size={6}>
                                                        <CustomFormLabel htmlFor="state" sx={{ mt: 0 }}>
                                                            State  <Typography color="error.main" component="span">
                                                                *
                                                            </Typography>
                                                        </CustomFormLabel>

                                                        <Autocomplete
                                                            value={formik.values.state}
                                                            options={states}
                                                            getOptionLabel={(option) => option}
                                                            renderInput={(params) => (
                                                                <TextField {...params} placeholder="Select State" variant="outlined" />
                                                            )}
                                                            onChange={(event, newValue) => {
                                                                formik.setFieldValue("state", newValue);
                                                                if (newValue) {
                                                                    onChangeStates(newValue);
                                                                } else {
                                                                    setZipCodes([]);
                                                                    formik.setFieldValue("zipCode", "");
                                                                    formik.setFieldValue("city", "");

                                                                }
                                                            }}
                                                        />
                                                        {formik.touched.state && formik.errors.state && (
                                                            <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.state}</FormHelperText>
                                                        )}
                                                    </Grid>
                                                    <Grid size={6}>
                                                        <CustomFormLabel htmlFor="addressLine1" sx={{ mt: 0 }}>
                                                            Zipcode <Typography color="error.main" component="span">
                                                                *
                                                            </Typography>
                                                        </CustomFormLabel>
                                                        <Autocomplete
                                                            value={formik.values.zipCode}
                                                            options={zipCodes}
                                                            getOptionLabel={(option) => option}
                                                            renderInput={(params) => (
                                                                <TextField {...params} placeholder="Select zipcode" variant="outlined" />
                                                            )}
                                                            onChange={(event, newValue) => {
                                                                formik.setFieldValue("zipCode", newValue);
                                                                if (newValue) {
                                                                    onChangeZipCode(newValue);
                                                                }
                                                            }}
                                                        />
                                                        {formik.touched.zipCode && formik.errors.zipCode && (
                                                            <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.zipCode}</FormHelperText>
                                                        )}
                                                    </Grid>

                                                </Grid>
                                                <Grid size={12}>
                                                    <CustomFormLabel htmlFor='city' sx={{ mt: 0 }}>City  <Typography color="error.main" component="span">
                                                        *
                                                    </Typography></CustomFormLabel>
                                                    <Autocomplete

                                                        value={formik.values.city}
                                                        options={cities}
                                                        getOptionLabel={(option) => option}
                                                        renderInput={(params) => (
                                                            <TextField {...params} placeholder="Select city" variant="outlined" />
                                                        )}
                                                        onChange={(event, newValue) => formik.setFieldValue("city", newValue)}
                                                    />
                                                    {formik.touched.city && formik.errors.city && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.city}</FormHelperText>
                                                    )}
                                                </Grid>
                                                <Grid size={12} spacing={1} container>
                                                    <Grid size={6}>
                                                        <CustomFormLabel htmlFor="phone" sx={{ mt: 0 }}>
                                                            Phone{" "}
                                                        </CustomFormLabel>
                                                        <CustomTextField id="phone" placeholder="Phone" fullWidth name="phone"
                                                            value={formik.values.phone}
                                                            onChange={formik.handleChange} />
                                                    </Grid>
                                                    <Grid size={6}>
                                                        <CustomFormLabel htmlFor="fax" sx={{ mt: 0 }}>
                                                            Fax{" "}
                                                        </CustomFormLabel>
                                                        <CustomTextField id="fax" placeholder="Fax" fullWidth name="fax" value={formik.values.fax}
                                                            onChange={formik.handleChange}
                                                        />
                                                    </Grid>
                                                </Grid>



                                                {/* <Grid size={12} spacing={1} container>
                                            <Grid size={4}>
                                                <CustomFormLabel htmlFor="state" sx={{ mt: 0 }}>
                                                    State  <Typography color="error.main" component="span">
                                                        *
                                                    </Typography>
                                                </CustomFormLabel>

                                                <Autocomplete
                                                    value={formik.values.state}
                                                    options={states}
                                                    getOptionLabel={(option) => option}
                                                    renderInput={(params) => (
                                                        <TextField {...params} placeholder="Select State" variant="outlined" />
                                                    )}
                                                    onChange={(event, newValue) => {
                                                        formik.setFieldValue("state", newValue);
                                                        if (newValue) {
                                                            onChangeStates(newValue);
                                                        } else {
                                                            setZipCodes([]);
                                                            formik.setFieldValue("zipCode", "");
                                                            formik.setFieldValue("city", "");

                                                        }
                                                    }}
                                                />
                                                {formik.touched.state && formik.errors.state && (
                                                    <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.state}</FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid size={4}>
                                                <CustomFormLabel htmlFor="addressLine1" sx={{ mt: 0 }}>
                                                    Zipcode <Typography color="error.main" component="span">
                                                        *
                                                    </Typography>
                                                </CustomFormLabel>s
                                                <Autocomplete
                                                    value={formik.values.zipCode}
                                                    options={zipCodes}
                                                    getOptionLabel={(option) => option}
                                                    renderInput={(params) => (
                                                        <TextField {...params} placeholder="Select zipcode" variant="outlined" />
                                                    )}
                                                    onChange={(event, newValue) => {
                                                        formik.setFieldValue("zipCode", newValue);
                                                        if (newValue) {
                                                            onChangeZipCode(newValue);
                                                        }
                                                    }}
                                                />
                                                {formik.touched.zipCode && formik.errors.zipCode && (
                                                    <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.zipCode}</FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid size={4}>
                                                <CustomFormLabel htmlFor='city' sx={{ mt: 0 }}>City  <Typography color="error.main" component="span">
                                                    *
                                                </Typography></CustomFormLabel>
                                                <Autocomplete
                                                    value={formik.values.city}
                                                    options={cities}
                                                    getOptionLabel={(option) => option}
                                                    renderInput={(params) => (
                                                        <TextField {...params} placeholder="Select city" variant="outlined" />
                                                    )}
                                                    onChange={(event, newValue) => formik.setFieldValue("city", newValue)}
                                                />
                                                {formik.touched.city && formik.errors.city && (
                                                    <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.city}</FormHelperText>
                                                )}
                                            </Grid>
                                        </Grid> */}
                                                {/* <Grid size={12}>
                                            <Autocomplete
                                                multiple

                                                options={allCities} // Không có options cố định
                                                // value={tags}
                                                // name="keywords"
                                                value={formik.values.cities}
                                                onChange={(event, newValue) =>
                                                    formik.setFieldValue("cities", newValue)}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip label={option} {...getTagProps({ index })} />
                                                    ))
                                                }
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Grid> */}

                                            </Grid>
                                        </Box>
                                    </BlankCard>
                                </Box>

                                <Box width="35%" alignItems="strech" paddingLeft={1} paddingRight={1}>
                                    <BlankCard sx={{ background: 'blue', height: '100%' }} height="100%">
                                        <Box p={1}>
                                            <Typography variant="h5">Open Time</Typography>
                                            <Box flexDirection="row" display="flex" alignItems="start" gap={1} mt={1}>
                                                <CustomFormLabel htmlFor='Name' sx={{ marginTop: '10px', minWidth: '35px', maxWidth: '35px', width: '35px' }}>Mon</CustomFormLabel>
                                                <CustomCheckbox name="isOpenMon" sx={{ marginTop: '5px', width: '45px' }} value={formik.values.isOpenMon}
                                                    checked={formik.values.isOpenMon}
                                                    onChange={formik.handleChange}

                                                />
                                                <Box flex="1">
                                                    <CustomTextField id="openTimeMon" placeholder="" fullWidth type="time"
                                                        name="openTimeMon" value={formik.values.openTimeMon}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.openTimeMon && Boolean(formik.errors.openTimeMon)}
                                                        helpertext={formik.touched.openTimeMon && formik.errors.openTimeMon}
                                                    />
                                                    {formik.touched.openTimeMon && formik.errors.openTimeMon && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.openTimeMon}</FormHelperText>
                                                    )}
                                                </Box>
                                                <Box flex="1">
                                                    <CustomTextField id="closeTimeMon" placeholder="" fullWidth type="time"
                                                        name="closeTimeMon" value={formik.values.closeTimeMon}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.closeTimeMon && Boolean(formik.errors.closeTimeMon)}
                                                        helpertext={formik.touched.closeTimeMon && formik.errors.closeTimeMon}
                                                    />
                                                    {formik.touched.closeTimeMon && formik.errors.closeTimeMon && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.closeTimeMon}</FormHelperText>
                                                    )}
                                                </Box>
                                            </Box>

                                            <Box flexDirection="row" display="flex" alignItems="start" gap={1} mt={2}>
                                                <CustomFormLabel htmlFor='Name' sx={{ marginTop: '10px', minWidth: '35px', maxWidth: '35px', width: '35px' }}>Tue</CustomFormLabel>
                                                <CustomCheckbox name="isOpenTue" sx={{ marginTop: '5px', width: '45px' }} value={formik.values.isOpenTue} checked={formik.values.isOpenTue}
                                                    onChange={formik.handleChange} />
                                                <Box flex="1">
                                                    <CustomTextField id="openTimeTue" placeholder="" fullWidth type="time"
                                                        name="openTimeTue" value={formik.values.openTimeTue}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.openTimeTue && Boolean(formik.errors.openTimeTue)}
                                                        helpertext={formik.touched.openTimeTue && formik.errors.openTimeTue}
                                                    />
                                                    {formik.touched.openTimeTue && formik.errors.openTimeTue && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.openTimeTue}</FormHelperText>
                                                    )}
                                                </Box>
                                                <Box flex="1">
                                                    <CustomTextField id="closeTimeTue" placeholder="" fullWidth type="time"
                                                        name="closeTimeTue" value={formik.values.closeTimeTue}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.closeTimeTue && Boolean(formik.errors.closeTimeTue)}
                                                        helpertext={formik.touched.closeTimeTue && formik.errors.closeTimeTue}
                                                    />
                                                    {formik.touched.closeTimeTue && formik.errors.closeTimeTue && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.closeTimeTue}</FormHelperText>
                                                    )}
                                                </Box>
                                            </Box>
                                            <Box flexDirection="row" display="flex" alignItems="start" gap={1} mt={2}>
                                                <CustomFormLabel htmlFor='Name' sx={{ marginTop: '10px', minWidth: '35px', maxWidth: '35px', width: '35px' }} >Wed</CustomFormLabel>
                                                <CustomCheckbox name="isOpenWed" sx={{ marginTop: '5px', width: '45px' }} value={formik.values.isOpenWed} checked={formik.values.isOpenWed}
                                                    onChange={formik.handleChange} />
                                                <Box flex="1">
                                                    <CustomTextField id="openTimeWed" placeholder="" fullWidth type="time" name="openTimeWed" value={formik.values.openTimeWed}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.openTimeWed && Boolean(formik.errors.openTimeWed)}
                                                        helpertext={formik.touched.openTimeWed && formik.errors.openTimeWed}
                                                    />
                                                    {formik.touched.openTimeWed && formik.errors.openTimeWed && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.openTimeWed}</FormHelperText>
                                                    )}
                                                </Box>
                                                <Box flex="1">
                                                    <CustomTextField id="closeTimeWed" placeholder="" fullWidth type="time" name="closeTimeWed" value={formik.values.closeTimeWed}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.closeTimeWed && Boolean(formik.errors.closeTimeWed)}
                                                        helpertext={formik.touched.closeTimeWed && formik.errors.closeTimeWed}

                                                    />
                                                    {formik.touched.closeTimeWed && formik.errors.closeTimeWed && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.closeTimeWed}</FormHelperText>
                                                    )}
                                                </Box>
                                            </Box>
                                            <Box flexDirection="row" display="flex" alignItems="start" gap={1} mt={2}>
                                                <CustomFormLabel htmlFor='isOpenThu' sx={{ marginTop: '10px', minWidth: '35px', maxWidth: '35px', width: '35px' }}>Thu</CustomFormLabel>
                                                <CustomCheckbox name="isOpenThu" sx={{ marginTop: '5px', width: '45px' }} value={formik.values.isOpenThu} checked={formik.values.isOpenThu}
                                                    onChange={formik.handleChange} />
                                                <Box flex="1">
                                                    <CustomTextField id="openTimeThu" placeholder="" fullWidth type="time" name="openTimeThu" value={formik.values.openTimeThu}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.openTimeThu && Boolean(formik.errors.openTimeThu)}
                                                        helpertext={formik.touched.openTimeThu && formik.errors.openTimeThu}
                                                    />
                                                    {formik.touched.openTimeThu && formik.errors.openTimeThu && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.openTimeThu}</FormHelperText>
                                                    )}
                                                </Box>
                                                <Box flex="1">
                                                    <CustomTextField id="closeTimeThu" placeholder="" fullWidth type="time" name="closeTimeThu" value={formik.values.closeTimeThu}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.closeTimeThu && Boolean(formik.errors.closeTimeThu)}
                                                        helpertext={formik.touched.closeTimeThu && formik.errors.closeTimeThu} />
                                                    {formik.touched.closeTimeThu && formik.errors.closeTimeThu && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.closeTimeThu}</FormHelperText>
                                                    )}
                                                </Box>
                                            </Box>
                                            <Box flexDirection="row" display="flex" alignItems="start" gap={1} mt={2}>
                                                <CustomFormLabel htmlFor='Name' sx={{ marginTop: '10px', minWidth: '35px', maxWidth: '35px', width: '35px' }}>Fri</CustomFormLabel>
                                                <CustomCheckbox name="isOpenFri" sx={{ marginTop: '5px', width: '45px' }} value={formik.values.isOpenFri} checked={formik.values.isOpenFri}
                                                    onChange={formik.handleChange} />
                                                <Box flex="1">
                                                    <CustomTextField id="openTimeFri" placeholder="" fullWidth type="time" name="openTimeFri" value={formik.values.openTimeFri}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.openTimeFri && Boolean(formik.errors.openTimeFri)}
                                                        helpertext={formik.touched.openTimeFri && formik.errors.openTimeFri} />
                                                    {formik.touched.openTimeFri && formik.errors.openTimeFri && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.openTimeFri}</FormHelperText>
                                                    )}
                                                </Box>
                                                <Box flex="1">
                                                    <CustomTextField id="closeTimeFri" placeholder="" fullWidth type="time" name="closeTimeFri" value={formik.values.closeTimeFri}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.closeTimeFri && Boolean(formik.errors.closeTimeFri)}
                                                        helpertext={formik.touched.closeTimeFri && formik.errors.closeTimeFri}
                                                    />
                                                    {formik.touched.closeTimeFri && formik.errors.closeTimeFri && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.closeTimeFri}</FormHelperText>
                                                    )}
                                                </Box>
                                            </Box>
                                            <Box flexDirection="row" display="flex" alignItems="start" gap={1} mt={2}>
                                                <CustomFormLabel htmlFor='Name' sx={{ marginTop: '10px', minWidth: '35px', maxWidth: '35px', width: '35px' }}>Sat</CustomFormLabel>
                                                <CustomCheckbox name="isOpenSat" sx={{ marginTOp: '5px', width: '45px' }} value={formik.values.isOpenSat} checked={formik.values.isOpenSat}
                                                    onChange={formik.handleChange} />
                                                <Box flex="1">
                                                    <CustomTextField id="openTimeSat" placeholder="" fullWidth type="time" name="openTimeSat" value={formik.values.openTimeSat}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.openTimeSat && Boolean(formik.errors.openTimeSat)}
                                                        helpertext={formik.touched.openTimeSat && formik.errors.openTimeSat}
                                                    />
                                                    {formik.touched.openTimeSat && formik.errors.openTimeSat && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.openTimeSat}</FormHelperText>
                                                    )}
                                                </Box>
                                                <Box flex="1">
                                                    <CustomTextField id="closeTimeSat" placeholder="" fullWidth type="time" name="closeTimeSat" value={formik.values.closeTimeSat}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.closeTimeSat && Boolean(formik.errors.closeTimeSat)}
                                                        helpertext={formik.touched.closeTimeSat && formik.errors.closeTimeSat}

                                                    />
                                                    {formik.touched.closeTimeSat && formik.errors.closeTimeSat && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.closeTimeSat}</FormHelperText>
                                                    )}
                                                </Box>
                                            </Box>
                                            <Box flexDirection="row" display="flex" alignItems="start" gap={1} mt={2}>
                                                <CustomFormLabel htmlFor='Name' sx={{ marginTop: '10px', minWidth: '35px', maxWidth: '35px', width: '35px' }}>Sun</CustomFormLabel>
                                                <CustomCheckbox sx={{ marginTop: '5px', width: '45px' }} name="isOpenSun" value={formik.values.isOpenSun} checked={formik.values.isOpenSun}
                                                    onChange={formik.handleChange} />
                                                <Box flex="1">
                                                    <CustomTextField id="openTimeSun" placeholder="" fullWidth type="time" name="openTimeSun" value={formik.values.openTimeSun}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.openTimeSun && Boolean(formik.errors.openTimeSun)}
                                                        helpertext={formik.touched.openTimeSun && formik.errors.openTimeSun}
                                                    />
                                                    {formik.touched.openTimeSun && formik.errors.openTimeSun && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.openTimeSun}</FormHelperText>
                                                    )}
                                                </Box>
                                                <Box flex="1">
                                                    <CustomTextField id="closeTimeSun" placeholder="" fullWidth type="time" name="closeTimeSun" value={formik.values.closeTimeSun}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.closeTimeSun && Boolean(formik.errors.closeTimeSun)}
                                                        helpertext={formik.touched.closeTimeSun && formik.errors.closeTimeSun} />
                                                    {formik.touched.closeTimeSun && formik.errors.closeTimeSun && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{formik.errors.closeTimeSun}</FormHelperText>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </BlankCard>
                                    {/* <BlankCard>
                                <Box p={3}>
                                    <Typography variant="h5">Status</Typography>
                                   
                                    <CustomSwitch name="status" checked={formik.values.status} onChange={formik.handleChange} sx={{ marginLeft: 0 }} />
                                </Box>
                            </BlankCard> */}
                                </Box>
                                <Box width="25%" alignItems="strech" paddingLeft={1}>
                                    <BlankCard height="100%">
                                        <Box p={1}>
                                            <Typography variant="h5">Thumnail</Typography>
                                            <Box
                                                mt={2}
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
                                                files are accepted.  Please upload images with a width greater than 300px and a ratio of 16/9
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
                                </Box>
                            </Box>
                        </Grid>
                    </TabPanel>
                    <TabPanel value="2" sx={{ height: '100%', overflowY: 'auto', alignItems: 'stretch' }}>
                        <Grid size={12} spacing={2} paddingTop={0}>
                            <BlankCard>
                                <Grid sx={{ padding: 2, width: '100%' }} display="flex" alignItems="center" justifyContent="space-between" size={12} >
                                    <CustomFormLabel htmlFor="addressLine2" sx={{ mt: 0 }}>
                                        City Setting{" "}
                                    </CustomFormLabel>

                                    <Fab color="primary" aria-label="send" size="small" onClick={() => { addCities(); }}>
                                        <IconPlus width={14}></IconPlus>
                                    </Fab>
                                </Grid>
                                <Grid size={12} spacing={1} container sx={{ padding: 2 }}>
                                    {
                                        formik.values.cities.map((city, index) => {


                                            console.log("debug-build-city", city);
                                            console.log("debug-build-formik.values.cities", formik.values.cities);

                                            return (<Grid container spacing={3} mb={2} size={12} sx={{ width: '100%' }}>
                                                <Grid size={3}>

                                                    <Autocomplete

                                                        value={city.state ?? ''}
                                                        options={states}
                                                        getOptionLabel={(option) => option}
                                                        renderInput={(params) => (
                                                            <TextField {...params} placeholder="Select State" variant="outlined" />
                                                        )}
                                                        onChange={(event, newValue) => {
                                                            // formik.handleChange(e);
                                                            console.log("debug-newValue", newValue);
                                                            formik.setFieldValue(`cities.${index}.state`, newValue);
                                                            formik.setFieldValue(`cities.${index}.city`, []);
                                                            onChangeStatesSearch(index, newValue ?? "");

                                                        }}
                                                    />
                                                    {formik.touched.cities && formik.errors.cities && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{(formik.errors.cities[index] as FormikErrors<{ state: string }> | undefined)?.state}</FormHelperText>
                                                    )}
                                                </Grid>
                                                <Grid size={8}>
                                                    <Autocomplete
                                                        ref={autocompleteRef}
                                                        disableClearable
                                                        multiple
                                                        disableCloseOnSelect
                                                        value={city.city ?? []}
                                                        options={city.cities ?? []}
                                                        getOptionLabel={(option) => option}
                                                        disabled={formik.values.cities[index].state == ""}
                                                        ListboxProps={{
                                                            style: {
                                                                maxHeight: 3 * 50, // 3 dòng * 48px mỗi dòng (chiều cao item mặc định)
                                                                overflowY: 'auto',
                                                            },
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField {...params} placeholder="Select city" variant="outlined" />
                                                        )}
                                                        renderOption={(props, option, { selected }) => {
                                                            // console.log("option", option);
                                                            // console.log("option-selected", selected);
                                                            // console.log("city.city.length", city.city.length);
                                                            // console.log("city.cities?.length", city.cities?.length);
                                                            console.log("debug-build-option", option);
                                                            console.log("debug-build-option", selected);
                                                            return (

                                                                <li {...props}>
                                                                    <Checkbox
                                                                        style={{ marginRight: 8 }}
                                                                        checked={
                                                                            option == "All"
                                                                                ? city.optionCities && city.optionCities.length == city.city.length
                                                                                : (city.city.includes(option) ? true : selected)
                                                                        }
                                                                    />
                                                                    {option}
                                                                </li>
                                                            )
                                                        }}
                                                        onChange={(e, newValue) => {
                                                            // const selectedCities = e.target.value as string[];
                                                            console.log("debug-selectedCities", newValue);
                                                            if (newValue?.includes("All")) {
                                                                // handleCityChange(row.id, allSelected ? [] : cityList);
                                                                // handleCityChange(index, allSelected ? [] : cityList);
                                                                // city.allSelected
                                                                // trừ 1
                                                                // if (city.cities?.length == (city.city.length - 1)) {
                                                                if (city.optionCities?.length == city.city.length) {
                                                                    handleCityChange(index, []);
                                                                } else {
                                                                    handleCityChange(index, city.optionCities ?? []);
                                                                }

                                                                setTimeout(() => {
                                                                    const input = autocompleteRef.current?.querySelector('input');
                                                                    input?.blur();
                                                                }, 100);

                                                            } else {
                                                                // handleCityChange(row.id, selectedCities);
                                                                // let cities = city.city
                                                                // if (cities.includes(newValue)) {
                                                                // } else 
                                                                //     cities.push(newValue);
                                                                // }
                                                                handleCityChange(index, [...newValue]);
                                                            }
                                                        }}
                                                    />

                                                    {formik.touched.cities && formik.errors.cities && (
                                                        <FormHelperText sx={{ color: theme.palette.error.main }}>{(formik.errors.cities[index] as FormikErrors<{ state: string }> | undefined)?.state}</FormHelperText>
                                                    )}


                                                </Grid>
                                                <Grid size={1} alignItems="center" display="flex">
                                                    <Tooltip title="Delete">
                                                        <IconButton size="large" color="error" onClick={() => { deleteRow(index); }}>
                                                            <IconTrash size={18}></IconTrash>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>)
                                        })
                                    }

                                </Grid>
                            </BlankCard>
                        </Grid>
                    </TabPanel>
                    <TabPanel value="3" sx={{ height: '100%', overflowY: 'auto', alignItems: 'stretch' }}>
                        <Grid size={12} spacing={2} paddingTop={0}>
                            <BlankCard>
                                <Box display="flex" flexDirection="row">
                                    <Typography variant="h6" fontSize="12px"> Latitude
                                    </Typography>
                                    <Typography variant="body1" fontSize="12px"> {props.location?.latitude ?? ''}
                                    </Typography>
                                    <Typography variant="h6" fontSize="12px"> Longitude
                                    </Typography>
                                    <Typography variant="body1" fontSize="12px"> {props.location?.longitude ?? ''}
                                    </Typography>
                                </Box>
                                <MapContainer center={[props.location?.latitude ?? 0, props.location?.longitude ?? 0]} zoom={13} style={{ height: '500px', width: '100%' }}>
                                    <TileLayer
                                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                        attribution='&copy; OpenStreetMap contributors'
                                    />
                                    <Marker position={[props.location?.latitude ?? 0, props.location?.longitude ?? 0]} icon={customIcon}>
                                        <Popup>{props.store.ownerstore}</Popup>
                                    </Marker>
                                </MapContainer>
                            </BlankCard>
                        </Grid>
                    </TabPanel>

                </Box>

            </TabContext>
            {/* <Grid container rowSpacing={0} spacing={2} mb={4}>
                <Grid size={12} sx={{ paddingTop: 0, marginTop: 0 }}>
                    <Divider></Divider>
                </Grid>
                <Grid size={12} mt={2}>
                </Grid>
            </Grid > */}
        </DialogContent >
        {/* <DialogActions>
           
        </DialogActions> */}
    </Dialog >
}

export default DialogLocation;





