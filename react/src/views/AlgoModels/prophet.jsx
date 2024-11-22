import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import * as tf from '@tensorflow/tfjs';
import ChartComponent from '../../components/charts/ChartComponent'; // Custom chart component
import axiosClient from '../../axios-client';

export default function Prophet() {
    useEffect(() => {
        const getAll = async() => {
            const data = await axiosClient.get('/get-forecasted-data');

            console.log(data.data);
        }
        getAll();
    }, []);
}
