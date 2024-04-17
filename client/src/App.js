import './App.css';
import Navbar from './components/Navbar';
import ClothesScreen from './components/ClothesScreen';
import React from 'react';
// import { test_api } from './api/Clothes';
import clothes from './test_data/test_clothes'; // Assuming the path to your clothes data
import ClothingCard from './components/ClothingCard';

export default function App() {
    // const onMainClick = async () => {
    //     console.log('Frontend click reaction');
    //     // You can add more logic here as needed
    //     await test_api();
    // };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            {/* <button onClick={onMainClick}>Press me</button> */}
            {/* <div className="flex-grow flex justify-center items-center">
                <ClothingCard clothing={clothes[0]} />
            </div> */}
            <div className="flex-grow flex justify-center items-center">
                <ClothesScreen clothingItemList={clothes} />
            </div>
        </div>
    );
}
