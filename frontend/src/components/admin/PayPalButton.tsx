// src/components/PayPalButton.tsx

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
    OrderResponseBody,
} from '@paypal/paypal-js';

const PayPalButton: React.FC = () => {
    return (
        <PayPalScriptProvider options={{ clientId: 'AeC0Eq4zGlez1yWtFJ_ZJZy5-_dKijce1xsrzx0EqsCjKqaWpk2A6I-zOV-OlUePxTHH351I0dykKerx' }}>
            <PayPalButtons
                createOrder={(
                    data: Record<string, unknown>,
                    actions: CreateOrderActions
                ) => {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: 'USD',
                                    value: '10.00', // Replace with the amount to charge
                                },
                            },
                        ],
                    });
                }}
                onApprove={(
                    data: OnApproveData,
                    actions: OnApproveActions
                ) => {
                    if (actions.order && actions.order.capture) {
                        return actions.order.capture().then((details: OrderResponseBody) => {
                            // Send transaction details to the backend
                            fetch('/api/paypal-transaction-complete', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    orderID: data.orderID,
                                    payerID: data.payerID,
                                }),
                            })
                                .then((response) => response.json())
                                .then(() => {
                                    alert(
                                        'Transaction completed by ' + details.payer?.name?.given_name
                                    );
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                });
                        });
                    } else {
                        console.error('Order capture not available');
                        return Promise.reject('Order capture not available');
                    }
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;

