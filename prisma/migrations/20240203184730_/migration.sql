-- CreateTable
CREATE TABLE "compras" (
    "id" SERIAL NOT NULL,
    "creation_date" DATE,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historic" (
    "id" SERIAL NOT NULL,
    "creation_date" DATE,

    CONSTRAINT "historic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens" (
    "id" SERIAL NOT NULL,
    "list_id" INTEGER,
    "name" VARCHAR(50),
    "amount" INTEGER,
    "price" DECIMAL,

    CONSTRAINT "itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "histori_itens" (
    "id" SERIAL NOT NULL,
    "list_id" INTEGER,
    "name" VARCHAR(50),
    "amount" INTEGER,
    "price" DECIMAL,

    CONSTRAINT "histori_itens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "compras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "histori_itens" ADD CONSTRAINT "histori_itens_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "historic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
