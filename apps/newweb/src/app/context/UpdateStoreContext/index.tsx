'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { InvoiceList, order } from '@/app/(DashboardLayout)/types/apps/invoice';
import axios from '@/utils/axios';
import { UserInfo } from '@/@types/user-props';
import useUsers from '@/hooks/users';
import { Category, Store } from '@/@types/store-props';
import useStore from '@/hooks/stores';
import { useRouter } from 'next/router';
import useStoreLocations from '@/hooks/store-locations';
import useStoreProducts from '@/hooks/store-products';
import { LocationInfo } from '@/@types/location-props';
import { Product } from '@/@types/product-props';
import useGeoRef from '@/hooks/georef';

interface UpdateStoreContextType {
    // invoices: InvoiceList[];
    // stores: Store[];
    data: Store,
    locations: LocationInfo[],
    products: Product[],
    loading: boolean;
    error: Error | null;
    deleteEmail: () => {},
    addInvoice: (newInvoice: InvoiceList) => void;
    updateInvoice: (updatedInvoice: InvoiceList) => void;
}

export const UpdateStoreContext = createContext<UpdateStoreContextType | any>(undefined);

export const UpdateStoreProvider: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
    const [data, setData] = useState<Store | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [locations, setLocations] = useState<LocationInfo[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    // const { isLoading, getUsers } = useUsers();
    const { isLoading, getStore, getCategories } = useStore();
    const { getStoreLocations } = useStoreLocations();

    const { getStoreProducts } = useStoreProducts();

    useEffect(() => {

        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const stores = await getStore(id);
            setData(stores);
            const locations = await getStoreLocations(id);
            setLocations(locations);
            const categories = await getCategories();
            setCategories(categories);
            const products = await getStoreProducts(id);
            setProducts(products);

            setLoading(false);
        } catch (error) {
            // setError(error);
            setLoading(false);
        }
    };


    // Function to delete an invoice
    const deleteInvoice = async (id: number) => {
        try {

            await axios.delete('/api/data/invoicedata/deleteinvoice', { data: { invoiceId: id } });
            // setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== id));
        } catch (error) {
            console.error('Error deleting invoice:', error);

        }
    };

    const addInvoice = async (newInvoice: InvoiceList) => {
        try {
            const response = await axios.post('/api/data/invoicedata/addinvoice', newInvoice);
            const addedInvoice = response.data;
            // setInvoices((prevInvoices) => [...prevInvoices, addedInvoice]);
        } catch (error) {
            console.error('Error adding invoice:', error);
        }
    };

    //  Function to update an invoice
    const updateInvoice = async (updatedInvoice: InvoiceList) => {
        try {
            const response = await axios.put('/api/data/invoicedata/updateinvoice', updatedInvoice);
            const updated = response.data;
            // setInvoices((prevInvoices) =>
            //     prevInvoices.map((invoice) => (invoice.id === updated.id ? updated : invoice))
            // );
        } catch (error) {
            console.error('Error updating invoice:', error);
        }
    };





    return (
        <UpdateStoreContext.Provider value={{ data, categories, locations, products, loading, error, deleteInvoice, addInvoice, updateInvoice, fetchData }}>
            {children}
        </UpdateStoreContext.Provider>
    );
};
