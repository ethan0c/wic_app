-- CreateTable
CREATE TABLE "wic_benefits" (
    "id" TEXT NOT NULL,
    "wic_card_number" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "category" TEXT NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "remaining_amount" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "month_period" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wic_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wic_stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chain" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "phone" TEXT,
    "hours_json" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wic_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "general_foods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "upc_code" TEXT,
    "plu_code" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "unit_size" TEXT,
    "nutrition" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "general_foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approved_foods" (
    "id" TEXT NOT NULL,
    "general_food_id" TEXT NOT NULL,
    "wic_category" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "approved_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approved_foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "wic_card_number" TEXT NOT NULL,
    "store_id" TEXT,
    "transaction_type" TEXT NOT NULL,
    "total_items" INTEGER NOT NULL DEFAULT 0,
    "total_value" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_items" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "approved_food_id" TEXT,
    "category" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prep_time" INTEGER,
    "cook_time" INTEGER,
    "servings" INTEGER,
    "difficulty" TEXT,
    "image_url" TEXT,
    "instructions" TEXT[],
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_items" (
    "id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "general_food_id" TEXT,
    "ingredient" TEXT NOT NULL,
    "quantity" TEXT,
    "unit" TEXT,
    "is_wic_eligible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "recipe_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_lists" (
    "id" TEXT NOT NULL,
    "wic_card_number" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "is_checked" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopping_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_flags" (
    "id" TEXT NOT NULL,
    "wic_card_number" TEXT,
    "general_food_id" TEXT NOT NULL,
    "flag_reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wic_benefits_wic_card_number_idx" ON "wic_benefits"("wic_card_number");

-- CreateIndex
CREATE INDEX "wic_benefits_month_period_idx" ON "wic_benefits"("month_period");

-- CreateIndex
CREATE UNIQUE INDEX "wic_benefits_wic_card_number_category_month_period_key" ON "wic_benefits"("wic_card_number", "category", "month_period");

-- CreateIndex
CREATE INDEX "general_foods_category_idx" ON "general_foods"("category");

-- CreateIndex
CREATE INDEX "general_foods_upc_code_idx" ON "general_foods"("upc_code");

-- CreateIndex
CREATE INDEX "general_foods_plu_code_idx" ON "general_foods"("plu_code");

-- CreateIndex
CREATE UNIQUE INDEX "general_foods_upc_code_key" ON "general_foods"("upc_code");

-- CreateIndex
CREATE UNIQUE INDEX "general_foods_plu_code_key" ON "general_foods"("plu_code");

-- CreateIndex
CREATE UNIQUE INDEX "approved_foods_general_food_id_key" ON "approved_foods"("general_food_id");

-- CreateIndex
CREATE INDEX "approved_foods_wic_category_idx" ON "approved_foods"("wic_category");

-- CreateIndex
CREATE INDEX "transactions_wic_card_number_idx" ON "transactions"("wic_card_number");

-- CreateIndex
CREATE INDEX "transactions_transaction_date_idx" ON "transactions"("transaction_date");

-- CreateIndex
CREATE INDEX "transaction_items_transaction_id_idx" ON "transaction_items"("transaction_id");

-- CreateIndex
CREATE INDEX "recipe_items_recipe_id_idx" ON "recipe_items"("recipe_id");

-- CreateIndex
CREATE INDEX "shopping_lists_wic_card_number_idx" ON "shopping_lists"("wic_card_number");

-- AddForeignKey
ALTER TABLE "approved_foods" ADD CONSTRAINT "approved_foods_general_food_id_fkey" FOREIGN KEY ("general_food_id") REFERENCES "general_foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "wic_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_approved_food_id_fkey" FOREIGN KEY ("approved_food_id") REFERENCES "approved_foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_items" ADD CONSTRAINT "recipe_items_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_items" ADD CONSTRAINT "recipe_items_general_food_id_fkey" FOREIGN KEY ("general_food_id") REFERENCES "general_foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
