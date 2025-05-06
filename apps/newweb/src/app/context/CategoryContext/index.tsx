'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { InvoiceList, order } from '@/app/(DashboardLayout)/types/apps/invoice';
import axios from '@/utils/axios';
import { UserInfo } from '@/@types/user-props';
import useUsers from '@/hooks/users';
import { CategoryInfo } from '@/@types/category-props';
import useCategories from '@/hooks/categories';

interface CategoryContextType {
    // invoices: InvoiceList[];
    data: CategoryInfo[];
    loading: boolean;
    error: Error | null;
    deleteEmail: () => {},
    addInvoice: (newInvoice: InvoiceList) => void;
    updateInvoice: (updatedInvoice: InvoiceList) => void;
}

export const CategoryContext = createContext<CategoryContextType | any>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<CategoryInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { isLoading, getCategories } = useCategories();

    useEffect(() => {


        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // const response = await axios.get('/api/data/invoicedata');
            const categories = await getCategories();

            setData(categories);
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
        <CategoryContext.Provider value={{ data, loading, error, deleteInvoice, addInvoice, updateInvoice, fetchData }}>
            {children}
        </CategoryContext.Provider>
    );
};
