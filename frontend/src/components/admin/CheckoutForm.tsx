// // CheckoutForm.tsx
// import React, { useState } from 'react';
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import { StripeCardElementOptions } from '@stripe/stripe-js';

// const CheckoutForm: React.FC = () => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [errorMessage, setErrorMessage] = useState<string>('');
//     const [isProcessing, setIsProcessing] = useState<boolean>(false);

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();

//         if (!stripe || !elements) {
//             setErrorMessage('Stripe has not loaded yet.');
//             return;
//         }

//         setIsProcessing(true);

//         const cardElement = elements.getElement(CardElement);

//         if (!cardElement) {
//             setErrorMessage('Card element not found.');
//             setIsProcessing(false);
//             return;
//         }

//         // Fetch the client secret from your backend
//         const response = await fetch('http://localhost:4000/create-payment-intent', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ amount: 1000 }), // Amount in cents
//         });

//         const { clientSecret } = await response.json();

//         const result = await stripe.confirmCardPayment(clientSecret, {
//             payment_method: { card: cardElement },
//         });

//         if (result.error) {
//             setErrorMessage(result.error.message || 'Payment failed');
//         } else {
//             if (result.paymentIntent?.status === 'succeeded') {
//                 // Payment succeeded
//                 setErrorMessage('Payment successful!');
//             }
//         }

//         setIsProcessing(false);
//     };

//     const CARD_OPTIONS: StripeCardElementOptions = {
//         style: {
//             base: {
//                 iconColor: '#666EE8',
//                 color: '#31325F',
//                 fontWeight: '300',
//                 fontSize: '18px',
//                 '::placeholder': { color: '#CFD7E0' },
//             },
//             invalid: { color: '#E25950' },
//         },
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <CardElement options={CARD_OPTIONS} />
//             <button type="submit" disabled={!stripe || isProcessing}>
//                 {isProcessing ? 'Processing...' : 'Pay'}
//             </button>
//             {errorMessage && <div>{errorMessage}</div>}
//         </form>
//     );
// };

// export default CheckoutForm;
////////
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElementOptions } from '@stripe/stripe-js';
// import './CheckoutForm.css';  // Import the updated CSS file
import PayPalButton from '../../components/admin/PayPalButton';

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage('Stripe has not loaded yet.');
            return;
        }

        setIsProcessing(true);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setErrorMessage('Card element not found.');
            setIsProcessing(false);
            return;
        }

        // Fetch the client secret from your backend
        const response = await fetch('http://localhost:4000/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 50000 }), // Amount in cents
        });

        const { clientSecret } = await response.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });

        if (result.error) {
            setErrorMessage(result.error.message || 'Payment failed');
        } else {
            if (result.paymentIntent?.status === 'succeeded') {
                setPaymentSuccess(true);
            }
        }

        setIsProcessing(false);
    };

    const CARD_OPTIONS: StripeCardElementOptions = {
        style: {
            base: {
                iconColor: '#666EE8',
                color: '#31325F',
                fontWeight: '300',
                fontSize: '18px',
                '::placeholder': { color: '#CFD7E0' },
            },
            invalid: { color: '#E25950' },
        },
    };

    return (
        <form className="checkout-form-container" onSubmit={handleSubmit}>
            <h1 className="checkout-form-title">Complete Your Payment</h1>
            <div className="card-element-container">
                <CardElement options={CARD_OPTIONS} />
            </div>

            <button
                type="submit"
                className="checkout-form-button"
                disabled={!stripe || isProcessing}
            >
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {paymentSuccess && <div className="success-message">Payment successful!</div>}

            <div className="payment-section">
                <h2>Make a Payment</h2>
                <PayPalButton />
            </div>
        </form>
    );
};

export default CheckoutForm;
