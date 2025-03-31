'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { InvoiceList, order } from '@/app/(DashboardLayout)/types/apps/invoice';
import axios from '@/utils/axios';
import { UserInfo } from '@/@types/user-props';
import useUsers from '@/hooks/users';
import { Category, Store, StoreRequest } from '@/@types/store-props';
import useStore from '@/hooks/stores';

interface StoreCreateContextType {
    // invoices: InvoiceList[];
    stores: Store[];
    loading: boolean;
    error: Error | null;
    deleteEmail: () => {},
    addInvoice: (newInvoice: InvoiceList) => void;
    updateInvoice: (updatedInvoice: InvoiceList) => void;
}

export const StoreCreateContext = createContext<StoreCreateContextType | any>(undefined);

export const StoreCreateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    // const { isLoading, getUsers } = useUsers();
    const { isLoading, getCategories, createStore } = useStore();

    useEffect(() => {


        fetchData();
    }, []);

    const fetchData = async (categoryId?: string) => {
        try {
            // const response = await axios.get('/api/data/invoicedata');
            const categories = await getCategories();
            console.log("categories", categories)
            setData(categories);
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

    const addStore = async (store: StoreRequest) => {
        try {
            return createStore(store);
            // const response = await axios.post('/api/data/invoicedata/addinvoice', newInvoice);
            // const addedInvoice = response.data;
            // setInvoices((prevInvoices) => [...prevInvoices, addedInvoice]);
        } catch (error) {
            console.error('Error adding invoice:', error);
            return {
                result: '',
                errorMessage: error,
                statusCode: 500
            };
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
        <StoreCreateContext.Provider value={{ data, loading, error, deleteInvoice, addInvoice, updateInvoice, fetchData, addStore }}>
            {children}
        </StoreCreateContext.Provider>
    );
};
