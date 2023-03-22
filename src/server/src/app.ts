import express from 'express';
import { Client } from 'pg';
import bodyParser from 'body-parser';

class DBRepository {
    client: Client;
    constructor() {
        this.client = new Client({
            user: 'postgres',
            host: 'localhost',
            password: 'aPassword',
            port: 5432,
        });
        this.client.connect();
    }

    async getTasks(): Promise<
        Array<{
            id: string,
            mes: number,
            pes: number,
            length: number,
            description: string,
        }>
    > {
        const result = await this.client.query(
            `SELECT id, description, length, mes, pes FROM public.task`,
        );
        return result.rows;
    }

    async createTask(task: {
        id: string,
        mes: number,
        pes: number,
        length: number,
        description: string,
    }) {
        await this.client.query(
            'INSERT INTO task(id, description, length, mes, pes) VALUES ($1, $2, $3, $4, $5)',
            [task.id, task.description, task.length, task.mes, task.pes],
        );
    }

    async getTimeslots(): Promise<
        Array<{
            id: string,
            startTime: number,
            mES: number,
            pES: number,
            length: number,
            scheduledTasks: {
                id: string,
                mES: number,
                pES: number,
                length: number,
                description: string,
                startTime: number,
                done: boolean,
            }
        }>
    > {
        return [];
    }


    async getLatestId(): Promise<number> {
        // get the maximum id occuring in the union of the table timeslot id column and table task id column and return 1 plus that maximum id
        return 0;
    }

    async updateTask(task: {
        id: string,
        mES: number,
        pES: number,
        length: number,
        description: string,
        startTime: number,
        done: boolean,
    }) {

    }

    async createTimeslot(timeslot: {
        id: string,
        startTime: number,
        mES: number,
        pES: number,
        length: number,
        scheduledTasks: {
            id: string,
            mES: number,
            pES: number,
            length: number,
            description: string,
            startTime: number,
            done: boolean,
        }
    }) {

    }

    async updateTimeslot(timeslot: {
        id: string,
        startTime: number,
        mES: number,
        pES: number,
        length: number,
        scheduledTasks: {
            id: string,
            mES: number,
            pES: number,
            length: number,
            description: string,
            startTime: number,
            done: boolean,
        }
    }) {

    }
}

const app = express();
const port = 3001;
const repo = new DBRepository();

app.use(bodyParser.json());

app.get('/tasks', async (req, res) => {
    const tasks = await repo.getTasks();
    res.json(tasks);
});

app.post('/tasks', async (req, res) => {
    const task = req.body;
    repo.createTask(task);
    res.json('created');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});