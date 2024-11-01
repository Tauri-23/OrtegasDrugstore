import { useEffect, useState } from "react";
import * as tf from '@tensorflow/tfjs';
import Papa from 'papaparse';
import ChartComponent from "../../components/charts/ChartComponent";
import { formatNumbersTwoDec, formatToPhilPeso } from "../../assets/js/utils";

export default function Prophet() {
    const [data, setData] = useState([]);
    const [forecast, setForecast] = useState([]);
    const [metrics, setMetrics] = useState(null); // State to store performance metrics

    useEffect(() => {
        Papa.parse('/src/assets/media/datasets/Expanded_Ortega_Synthetic_Data.csv', {
            download: true,
            header: true,
            complete: (result) => {
                const parsedData = result.data.reduce((acc, row) => {
                    if (row.ds && row.ds.trim() !== '') {
                        const parsedDate = new Date(row.ds);
                        if (!isNaN(parsedDate.getTime())) {
                            acc.push({
                                ...row,
                                ds: parsedDate
                            });
                        } else {
                            console.error(`Invalid date found in row:`, row);
                        }
                    } else {
                        console.error(`Empty date found in row:`, row);
                    }
                    return acc;
                }, []);
                setData(parsedData);
            },
            error: (error) => console.error("Error reading CSV file:", error)
        });
    }, []);

    const trainModel = async () => {
        if (data.length === 0) {
            console.error("No data available for training.");
            return;
        }
        
        const featureData = data.map(d => [
            parseFloat(d.price_per_unit),
            parseFloat(d.marketing_spend),
            parseFloat(d.competitor_price),
            parseFloat(d.promotion_flag),
            parseFloat(d.is_holiday),
            parseFloat(d.medicine_id)
        ]);
        
        const features = tf.tensor2d(featureData, [featureData.length, featureData[0].length]);

        const mean = features.mean(0);
        const squaredDifferences = features.sub(mean).square();
        const variance = squaredDifferences.mean(0);
        const std = tf.sqrt(variance);
        const normalizedFeatures = features.sub(mean).div(std);

        const labels = tf.tensor1d(data.map(d => parseFloat(d.y) || 0));

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 256, activation: 'ELU', inputShape: [features.shape[1]] }));
        model.add(tf.layers.dense({ units: 128, activation: 'ELU' }));
        model.add(tf.layers.dense({ units: 1 }));

        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'meanSquaredError'
        });

        await model.fit(normalizedFeatures, labels, {
            epochs: 100,
            batchSize: 32,
            validationSplit: 0.2
        });
    
        return model;
    };

    const predictFuture = async (model) => {
        const lastKnownValues = data[data.length - 1];
        const futureForecast = [];
        const actualValues = []; // Store actual values for performance metrics
        let futureDate = new Date(lastKnownValues.ds);
        
        for (let i = 1; i <= 30; i++) {
            futureDate.setDate(futureDate.getDate() + 1);

            const inputTensor = tf.tensor2d([[ 
                parseFloat(lastKnownValues.price_per_unit) * (1 + 0.01 * i), // Example it increases 1%
                parseFloat(lastKnownValues.marketing_spend),
                parseFloat(lastKnownValues.competitor_price),
                parseFloat(lastKnownValues.promotion_flag),
                parseFloat(lastKnownValues.is_holiday),
                parseFloat(lastKnownValues.medicine_id)
            ]]);
            
            const prediction = model.predict(inputTensor);
            const yhat = prediction.dataSync()[0];

            // Store the forecast
            futureForecast.push({ ds: new Date(futureDate), yhat });

            // Store the actual value for performance calculation (you can replace this with actual data if available)
            actualValues.push(parseFloat(lastKnownValues.y)); // Use actual value from your dataset
            
            // Update last known values
            lastKnownValues.y = yhat;

            tf.dispose([inputTensor, prediction]);
        }

        setForecast(futureForecast);
        // Calculate performance metrics
        const metrics = calculatePerformanceMetrics(actualValues, futureForecast.map(f => f.yhat));
        setMetrics(metrics);
    };

    const calculatePerformanceMetrics = (actual, predicted) => {
        const n = actual.length;

        const absoluteErrors = predicted.map((pred, index) => Math.abs(pred - actual[index]));
        const squaredErrors = predicted.map((pred, index) => Math.pow(pred - actual[index], 2));

        const mae = absoluteErrors.reduce((acc, err) => acc + err, 0) / n;
        const mse = squaredErrors.reduce((acc, err) => acc + err, 0) / n;
        const rmse = Math.sqrt(mse);
        
        const meanActual = actual.reduce((acc, val) => acc + val, 0) / n;
        const ssTotal = actual.reduce((acc, val) => acc + Math.pow(val - meanActual, 2), 0);
        const ssResidual = squaredErrors.reduce((acc, err) => acc + err, 0);
        const rSquared = 1 - (ssResidual / ssTotal);

        return {
            mae,
            mse,
            rmse,
            rSquared
        };
    };

    useEffect(() => {
        if(data.length > 0) {
            trainModel().then(predictFuture);
        }
    }, [data]);

    useEffect(() => {
        console.log(forecast);
    }, [forecast]);

    return (
        <div>
            <h2>Pharmacy Sales Forecast for the next 30 days</h2>
            <div style={{ width: "800px", height: "750px" }}>
                <ChartComponent forecast={forecast} />
            </div>
            {metrics && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <h3>Performance Metrics</h3>
                    <p><strong>Mean Absolute Error (MAE):</strong> {formatNumbersTwoDec(metrics.mae)}</p>
                    <p><strong>Mean Squared Error (MSE):</strong> {formatNumbersTwoDec(metrics.mse)}</p>
                    <p><strong>Root Mean Squared Error (RMSE):</strong> {formatNumbersTwoDec(metrics.rmse)}</p>
                    <p><strong>R-squared:</strong> {metrics.rSquared.toFixed(4)}</p>
                </div>
            )}
        </div>
    );
}
