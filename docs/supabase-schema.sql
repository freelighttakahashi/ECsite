-- FREELIGHT EC サイト用 Supabase スキーマ
-- Supabase ダッシュボード → SQL Editor に貼り付けて実行

-- 1. ブランド
create table if not exists brands (
    id    bigint primary key,
    name  text not null,
    slug  text unique
);

-- 2. カテゴリ
create table if not exists categories (
    id         bigint primary key,
    name       text not null,
    slug       text unique,
    sort_order int default 0
);

-- 3. 商品
create table if not exists products (
    id               bigint primary key,
    title            text not null,
    description_html text,
    category_id      bigint references categories(id),
    brand_id         bigint references brands(id),
    price_ex_tax     int not null,
    price_incl_tax   int not null,
    is_new           boolean default false,
    images           text[] default '{}',
    created_at       timestamptz default now()
);

-- 4. 注文
create table if not exists orders (
    id               uuid primary key default gen_random_uuid(),
    order_number     text unique not null,
    customer_name    text not null,
    email            text not null,
    phone            text,
    address          text not null,
    items            jsonb not null,
    total_ex_tax     int not null,
    total_incl_tax   int not null,
    status           text not null default 'pending_payment',
    payment_deadline timestamptz,
    created_at       timestamptz default now(),
    updated_at       timestamptz default now()
);

-- ステータス値の参考:
-- pending_payment : 入金待ち
-- paid            : 入金確認済
-- shipped         : 発送済
-- cancelled       : キャンセル

-- updated_at 自動更新
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
before update on orders
for each row execute function set_updated_at();

-- 5. RLS (Row Level Security)
alter table brands      enable row level security;
alter table categories  enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;

-- 公開読み取り (商品・カテゴリ・ブランド)
create policy "public read brands"      on brands      for select using (true);
create policy "public read categories"  on categories  for select using (true);
create policy "public read products"    on products    for select using (true);

-- 注文は誰でも INSERT 可 (ゲスト注文)
create policy "anyone can insert orders" on orders for insert with check (true);

-- 注文の SELECT/UPDATE は service_role のみ (RLS をバイパスするためポリシー不要)
-- 管理画面は service_role キーでアクセスします。

-- 6. インデックス
create index if not exists products_category_idx on products(category_id);
create index if not exists orders_status_idx     on orders(status);
create index if not exists orders_created_idx    on orders(created_at desc);