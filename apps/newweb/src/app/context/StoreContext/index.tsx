'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { InvoiceList, order } from '@/app/(DashboardLayout)/types/apps/invoice';
import axios from '@/utils/axios';
import { UserInfo } from '@/@types/user-props';
import useUsers from '@/hooks/users';
import { Store } from '@/@types/store-props';
import useStore from '@/hooks/stores';

interface StoreContextType {
    // invoices: InvoiceList[];
    stores: Store[];
    loading: boolean;
    error: Error | null;
    deleteEmail: () => {},
    addInvoice: (newInvoice: InvoiceList) => void;
    updateInvoice: (updatedInvoice: InvoiceList) => void;
}

export const StoreContext = createContext<StoreContextType | any>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    // const { isLoading, getUsers } = useUsers();
    const { isLoading, getStores, updateStore, getCategories } = useStore();

    useEffect(() => {


        fetchData();
    }, []);

    const fetchData = async (categoryId?: string) => {
        try {
            // const response = await axios.get('/api/data/invoicedata');
            const stores = await getStores(categoryId);

            setData(stores);
            setLoading(false);
        } catch (error) {
            // setError(error);
            setLoading(false);
        }
    };

    const getData = async (categoryId?: string) => {
        // const stores = await getStores(categoryId);
        // if (!categoryId) {
        //     const categories = await getCategories();
        //     const _categoryItems: ComboboxItem[] = categories.map((item) => {
        //         return {
        //             value: item.id,
        //             label: item.name
        //         };
        //     });
        //     setCategories([{
        //         value: "", label: 'All categories'
        //     }, ..._categoryItems]);
        // }
        // setData(stores);
        // setDataFiltered(stores);
    }

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
        <StoreContext.Provider value={{ data, loading, error, deleteInvoice, addInvoice, updateInvoice, fetchData }}>
            {children}
        </StoreContext.Provider>
    );
};
