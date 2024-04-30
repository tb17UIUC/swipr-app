import client from './client';

// Function to attempt customer login
export const loginCustomer = async (login) => {
    try {
        const response = await client.post('/customer/login', login);
        if (response.status === 201) {
            console.log('Login successful');
            return response.data.customerId;
        } else {
            console.log('Login failed');
            return null;
        }
    } catch (error) {
        console.error('Failed to login:', error);
        throw error;
    }
};

export const registerCustomer = async (customerData) => {
    try {
        const response = await client.post('/customer/register', customerData);
        if (response.status === 201) {
            console.log('Registration successful');
            return response.data.customerId;
        } else {
            console.log('Registration failed with status:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Failed to register:', error);
        throw error;
    }
};

export const updateCustomer = async (customerData, customerId) => {
    try {
        const response = await client.put(
            `/customer/update/${customerId}`,
            customerData
        );
        if (response.status === 200) {
            console.log('Customer updated successfully');
            return true;
        } else {
            console.log('Update failed with status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Failed to update customer:', error);
        throw error;
    }
};


export const deleteCustomer = async (customerId) => {
    try {
        const response = await client.delete(
            '/customer/delete/', {data: {customerId},});
        if (response.status === 200) {
            console.log('Customer deleted successfully');
            return true;
        } else {
            console.log('Delete failed with status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Failed to Delete customer:', error);
        throw error;
    }
};

export const fetchCustomerInfo = async (customerId) => {
    try {
        const response = await client.get(`/customer/info/${customerId}`);
        if (response.status === 200) {
            console.log('Fetch successful');
            console.log(response.data);
            return response.data;
        } else {
            console.log('Fetch failed with status:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch customer info:', error);
        throw error;
    }
};
