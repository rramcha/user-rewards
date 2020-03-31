import React, { Component } from 'react'
import './rewardsHome.css';
import userInfo from '../../mock-data/data.json';

class RewardsHome extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userInfo
        }
    }

    componentDidMount() {
        const { userInfo } = this.state;
        let rewardsSummary;

        if (!userInfo) return;
        rewardsSummary = this.calculateResults(userInfo);

        this.setState({
            rewardsSummary
        })
    }

    calculatePointsPerTransaction = (data) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let pointsByCustomer = {};
        let totalPointsByCustomer = {};

        const pointsPerTransaction = data.map(transaction => {
            const { amount, transactionDate } = transaction;
            let points, month;

            if (amount >= 50 && amount < 100) {
                points = amount - 50
            } else if (amount > 100) {
                points = (2 * (amount - 100) + 50);
            } else {
                points = 0
            }

            month = new Date(transactionDate).getMonth();
            return { ...transaction, points, month };
        });

        pointsPerTransaction.forEach(pointsPerTransaction => {
            const { customerID, name, month, points } = pointsPerTransaction;

            if (!pointsByCustomer[customerID]) {
                pointsByCustomer[customerID] = [];
            }
            if (!totalPointsByCustomer[customerID]) {
                totalPointsByCustomer[name] = 0;
            }

            totalPointsByCustomer[name] += points;

            if (pointsByCustomer[customerID][month]) {
                pointsByCustomer[customerID][month].points += points;
                pointsByCustomer[customerID][month].monthNumber = month;
                pointsByCustomer[customerID][month].numOfTransactions++;
            }
            else {
                pointsByCustomer[customerID][month] = {
                    customerID,
                    name,
                    monthNumber: month,
                    month: months[month],
                    numOfTransactions: 1,
                    points,
                }
            }
        });

        return { pointsByCustomer, totalPointsByCustomer, pointsPerTransaction }
    }

    calculatesummaryByCustomer = (pointsByCustomer) => {
        let summary = [];

        for (let customer in pointsByCustomer) {
            pointsByCustomer[customer].forEach(val => {
                summary.push(val);
            });
        }

        return summary
    }

    calculateTotalPointsByCustomer = (totalPointsByCustomer) => {
        let totalPoints = [];

        for (let customer in totalPointsByCustomer) {
            totalPoints.push({
                name: customer,
                points: totalPointsByCustomer[customer]
            });
        }

        return totalPoints
    }

    calculateResults = (data) => {
        const { pointsByCustomer, totalPointsByCustomer, pointsPerTransaction } = this.calculatePointsPerTransaction(data);
        const summaryByCustomer = this.calculatesummaryByCustomer(pointsByCustomer);
        const totalPoints = this.calculateTotalPointsByCustomer(totalPointsByCustomer);

        return {
            summaryByCustomer,
            pointsPerTransaction,
            totalPointsByCustomer: totalPoints
        };
    }


    render() {
        const { rewardsSummary } = this.state;

        return (
            <div>
                <table id="t01" className="user-table">
                    <tbody>
                        <tr>
                            <th>Customer Name</th>
                            <th>Month</th>
                            <th>No. of transactions</th>
                            <th>Reward points</th>
                        </tr>
                        {
                            rewardsSummary && rewardsSummary.summaryByCustomer && rewardsSummary.summaryByCustomer.map(this.renderSummaryByCustomerGrid)
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    renderSummaryByCustomerGrid = (data, index) => {
        const { name, month, numOfTransactions, points } = data;
        return (
            <tr key={index}>
                <td>{name}</td>
                <td>{month}</td>
                <td>{numOfTransactions}</td>
                <td>{points}</td>
            </tr>
        )
    }
}

export default RewardsHome