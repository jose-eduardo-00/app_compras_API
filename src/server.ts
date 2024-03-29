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

    try {
        const listWithSameDate = await prisma.compra.findFirst({
            where: { creation_date: { equals: new Date(creation_date) } },
        });

        if (listWithSameDate) {
            return res.status(409).send({ message: "Já existe uma lista de compras criada nessa data" });
        }

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

    } catch (error) {
        return res.status(500).send({ message: "Falha ao criar a lista" });
    }

    res.status(201).send();
});

app.delete("/list/:id", async (req, res) => {
    const idList = Number(req.params.id);

    try {
        const list = await prisma.compra.findUnique({ where: { id: idList } });

        if (!list) {
            return res.status(404).send({ message: "A lista não foi encontrada" });
        }

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
    } catch (error) {
        res.status(500).send({ message: "Não foi possível remover a lista" });
    }

    res.status(200).send();
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

    try {
        const itenWithSameName = await prisma.iten.findFirst({
            where: { name: { equals: name, mode: "insensitive" } },
        });

        if (itenWithSameName) {
            return res.status(409).send({ message: "Já existe um item com esse nome cadastrado" });
        }

        await prisma.iten.create({
            data: {
                list_id: Number(list_id),
                name: name,
                amount: Number(amount),
                price: Number(price)
            }
        });

        await prisma.histori_iten.create({
            data: {
                list_id: Number(list_id),
                name: name,
                amount: Number(amount),
                price: Number(price)
            }
        });

    } catch (error) {
        return res.status(500).send({ message: "Falha ao cadastrar item" });
    }

    res.status(201).send();
});

app.delete("/itens/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const iten = await prisma.iten.findUnique({ where: { id: id } });

        if (!iten) {
            return res.status(404).send({ message: "O item não foi encontrado" });
        }

        await prisma.iten.delete({
            where: {
                id: id
            }
        });

    } catch (error) {
        return res.status(500).send({ message: "Não foi possível remover o item" });
    }


    res.status(200).send();
});

app.get("/historic_itens", async (req, res) => {
    const historicItens = await prisma.histori_iten.findMany();
    res.status(201).send(historicItens);
});

app.listen(5432, () => {
    console.log("Servidor em execução");
});