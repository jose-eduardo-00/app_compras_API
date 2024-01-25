import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET, OPTIONS, PUT, POST, DELETE"
}));

app.get("/list", async (req, res) => {
    const lists = await prisma.compra.findMany();
    res.send(lists);
});

app.post("/list", async (req, res) => {

    const { creation_date } = req.body;

    await prisma.compra.create({
        data: {
            creation_date: new Date(creation_date)
        }
    });

    await prisma.historic.create({
        data: {
            creation_date: new Date(creation_date)
        }
    });

    res.status(201).send();
});

app.delete("/list/:id", async (req, res) => {
    const idList = Number(req.params.id);

    await prisma.iten.deleteMany({
        where: {
            list_id: idList
        }
    });

    await prisma.compra.delete({
        where: {
            id: idList
        }
    });

    res.status(201).send();
});

app.get("/historic", async (req, res) => {
    const historics = await prisma.historic.findMany();
    res.send(historics);
});

app.get("/itens", async (req, res) => {
    const itens = await prisma.iten.findMany();
    res.send(itens);
});

app.post("/itens", async (req, res) => {

    const { list_id, name, amount, price } = req.body;

    await prisma.iten.create({
        data: {
            list_id: Number(list_id),
            name: name,
            amount: Number(amount),
            price: Number(price)
        }
    });
    res.status(201).send();
});

app.delete("/itens/:id", async (req, res) => {
    const id = Number(req.params.id);

    await prisma.iten.delete({
        where: {
            id: id
        }
    });
    res.status(201).send();
});

app.listen(3000, () => {
    console.log("Servidor em execução");
});