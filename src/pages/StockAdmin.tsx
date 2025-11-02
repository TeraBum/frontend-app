import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { StockProductService, StockService } from "../services/api";

interface StockItem {
  product_id: string | null;
  warehouse_id: string | null;
  quantity: number | null;
  reserved: number | null;
  updated_at?: string | null;
}

interface StockProduct {
  id: string | null;
  name: string | null;
  description: string | null;
  price: number | null;
  category: string | null;
  imagesJson?: unknown;
  isActive: boolean | null;
  createdAt?: string | null;
}

interface CreateFormState {
  product_id: string;
  warehouse_id: string;
  quantity: string;
  reserved: string;
}

interface EditFormState {
  quantity: string;
  reserved: string;
}

interface BaixaFormState {
  product_id: string;
  warehouse_id: string;
  quantity: string;
}

interface ProductCreateFormState {
  name: string;
  description: string;
  price: string;
  category: string;
  imagesJson: string;
  isActive: boolean;
}

interface ProductEditFormState {
  name: string;
  description: string;
  price: string;
  category: string;
  imagesJson: string;
  isActive: boolean;
}

type ActionLoadingState = {
  createStock: boolean;
  updateStock: boolean;
  deleteStock: boolean;
  baixaStock: boolean;
  createProduct: boolean;
  updateProduct: boolean;
  deleteProduct: boolean;
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as {
      msg?: string;
      message?: string;
      error?: string;
      detail?: string;
    };
    return (
      data?.msg ||
      data?.message ||
      data?.error ||
      data?.detail ||
      "Erro ao comunicar com o serviço de estoque."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado ao comunicar com o serviço de estoque.";
};

const initialCreateState: CreateFormState = {
  product_id: "",
  warehouse_id: "",
  quantity: "",
  reserved: "",
};

const initialEditState: EditFormState = {
  quantity: "",
  reserved: "",
};

const initialBaixaState: BaixaFormState = {
  product_id: "",
  warehouse_id: "",
  quantity: "",
};

const initialProductCreateState: ProductCreateFormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  imagesJson: "",
  isActive: true,
};

const initialProductEditState: ProductEditFormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  imagesJson: "",
  isActive: false,
};

const StockAdmin: React.FC = () => {
  const [items, setItems] = useState<StockItem[]>([]);
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [productPage, setProductPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);

  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<StockProduct | null>(null);

  const [createForm, setCreateForm] = useState<CreateFormState>(initialCreateState);
  const [editForm, setEditForm] = useState<EditFormState>(initialEditState);
  const [baixaForm, setBaixaForm] = useState<BaixaFormState>(initialBaixaState);

  const [productCreateForm, setProductCreateForm] = useState<ProductCreateFormState>(
    initialProductCreateState
  );
  const [productEditForm, setProductEditForm] =
    useState<ProductEditFormState>(initialProductEditState);

  const [actionLoading, setActionLoading] = useState<ActionLoadingState>({
    createStock: false,
    updateStock: false,
    deleteStock: false,
    baixaStock: false,
    createProduct: false,
    updateProduct: false,
    deleteProduct: false,
  });

  const productPageSize = 15;

  const resetMessages = () => {
    setFeedback(null);
    setError(null);
  };

  const fetchItems = async (): Promise<StockItem[]> => {
    try {
      const res = await StockService.listItems();
      const list: StockItem[] = Array.isArray(res.data?.stock_items)
        ? res.data.stock_items
        : [];
      setItems(list);
      return list;
    } catch (err) {
      setError(getErrorMessage(err));
      return [];
    }
  };

  const fetchProducts = async (preservePage = false): Promise<StockProduct[]> => {
    try {
      const res = await StockProductService.list();
      const list: StockProduct[] = Array.isArray(res.data?.products)
        ? res.data.products
        : [];
      setProducts(list);
      if (!preservePage) {
        setProductPage(1);
      }
      return list;
    } catch (err) {
      setError(getErrorMessage(err));
      return [];
    }
  };

  useEffect(() => {
    const load = async () => {
      resetMessages();
      setLoading(true);
      await Promise.all([fetchItems(), fetchProducts()]);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProductPage((prev) => {
      const totalPages = Math.max(1, Math.ceil(products.length / productPageSize));
      if (prev < 1) {
        return 1;
      }
      if (prev > totalPages) {
        return totalPages;
      }
      return prev;
    });
  }, [products.length, productPageSize]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      errorRef.current.focus({ preventScroll: true });
    }
  }, [error]);

  const goToProductPage = (page: number) => {
    const totalPages = Math.max(1, Math.ceil(products.length / productPageSize));
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setProductPage(clamped);
  };

  const handlePrevProductPage = () => goToProductPage(productPage - 1);
  const handleNextProductPage = () => goToProductPage(productPage + 1);

  const handleCreateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBaixaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBaixaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectItem = (item: StockItem) => {
    resetMessages();
    setSelectedItem(item);
    setEditForm({
      quantity:
        item.quantity !== null && item.quantity !== undefined ? String(item.quantity) : "",
      reserved:
        item.reserved !== null && item.reserved !== undefined ? String(item.reserved) : "",
    });
    setBaixaForm((prev) => ({
      ...prev,
      product_id: item.product_id ?? "",
      warehouse_id: item.warehouse_id ?? "",
    }));
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (
      !createForm.product_id.trim() ||
      !createForm.warehouse_id.trim() ||
      createForm.quantity.trim() === "" ||
      createForm.reserved.trim() === ""
    ) {
      setError("Preencha todos os campos do formulário de criação de estoque.");
      return;
    }

    const quantity = parseInt(createForm.quantity, 10);
    const reserved = parseInt(createForm.reserved, 10);

    if (Number.isNaN(quantity) || quantity < 0) {
      setError("Quantidade deve ser um número inteiro maior ou igual a zero.");
      return;
    }

    if (Number.isNaN(reserved) || reserved < 0) {
      setError("Reservado deve ser um número inteiro maior ou igual a zero.");
      return;
    }

    setActionLoading((prev) => ({ ...prev, createStock: true }));

    try {
      await StockService.createItem({
        product_id: createForm.product_id.trim(),
        warehouse_id: createForm.warehouse_id.trim(),
        quantity,
        reserved,
      });

      setFeedback("Item de estoque criado com sucesso.");
      setCreateForm(initialCreateState);
      setBaixaForm((prev) => ({
        ...prev,
        product_id: "",
        warehouse_id: "",
      }));

      await fetchItems();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, createStock: false }));
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedItem || !selectedItem.product_id || !selectedItem.warehouse_id) {
      setError("Selecione um item válido para atualização.");
      return;
    }

    resetMessages();

    if (editForm.quantity.trim() === "" && editForm.reserved.trim() === "") {
      setError("Informe a nova quantidade e/ou o valor reservado para atualizar.");
      return;
    }

    const payload: Record<string, string | number> = {
      product_id: selectedItem.product_id,
      warehouse_id: selectedItem.warehouse_id,
    };

    if (editForm.quantity.trim() !== "") {
      const quantity = parseInt(editForm.quantity, 10);
      if (Number.isNaN(quantity) || quantity < 0) {
        setError("Quantidade deve ser um número inteiro maior ou igual a zero.");
        return;
      }
      payload.quantity = quantity;
    }

    if (editForm.reserved.trim() !== "") {
      const reserved = parseInt(editForm.reserved, 10);
      if (Number.isNaN(reserved) || reserved < 0) {
        setError("Reservado deve ser um número inteiro maior ou igual a zero.");
        return;
      }
      payload.reserved = reserved;
    }

    setActionLoading((prev) => ({ ...prev, updateStock: true }));

    try {
      await StockService.updateItem(selectedItem.warehouse_id, selectedItem.product_id, payload);

      setFeedback("Item de estoque atualizado com sucesso.");
      const updatedItems = await fetchItems();
      const refreshed = updatedItems.find(
        (item) =>
          item.product_id === selectedItem.product_id &&
          item.warehouse_id === selectedItem.warehouse_id
      );
      setSelectedItem(refreshed ?? null);
      if (refreshed) {
        setEditForm({
          quantity:
            refreshed.quantity !== null && refreshed.quantity !== undefined
              ? String(refreshed.quantity)
              : "",
          reserved:
            refreshed.reserved !== null && refreshed.reserved !== undefined
              ? String(refreshed.reserved)
              : "",
        });
      } else {
        setEditForm(initialEditState);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, updateStock: false }));
    }
  };

  const handleDelete = async (item: StockItem) => {
    if (!item.product_id || !item.warehouse_id) {
      setError("Não foi possível identificar o item selecionado.");
      return;
    }

    resetMessages();

    const confirmDelete = window.confirm(
      "Tem certeza que deseja remover este item do estoque?"
    );

    if (!confirmDelete) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, deleteStock: true }));

    try {
      await StockService.deleteItem(item.warehouse_id, item.product_id);
      setFeedback("Item removido do estoque.");

      const updatedItems = await fetchItems();
      if (
        selectedItem &&
        selectedItem.product_id === item.product_id &&
        selectedItem.warehouse_id === item.warehouse_id
      ) {
        const refreshed = updatedItems.find(
          (it) =>
            it.product_id === item.product_id &&
            it.warehouse_id === item.warehouse_id
        );
        if (!refreshed) {
          setSelectedItem(null);
          setEditForm(initialEditState);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, deleteStock: false }));
    }
  };

  const handleBaixa = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (
      !baixaForm.product_id.trim() ||
      !baixaForm.warehouse_id.trim() ||
      baixaForm.quantity.trim() === ""
    ) {
      setError("Preencha produto, armazém e quantidade para registrar a baixa.");
      return;
    }

    const quantity = parseInt(baixaForm.quantity, 10);
    if (Number.isNaN(quantity) || quantity <= 0) {
      setError("Quantidade da baixa deve ser um inteiro maior que zero.");
      return;
    }

    setActionLoading((prev) => ({ ...prev, baixaStock: true }));

    try {
      await StockService.baixa({
        product_id: baixaForm.product_id.trim(),
        warehouse_id: baixaForm.warehouse_id.trim(),
        quantity,
      });

      setFeedback("Baixa registrada com sucesso.");
      setBaixaForm((prev) => ({ ...prev, quantity: "" }));

      const updatedItems = await fetchItems();
      if (selectedItem) {
        const refreshed = updatedItems.find(
          (item) =>
            item.product_id === selectedItem.product_id &&
            item.warehouse_id === selectedItem.warehouse_id
        );
        setSelectedItem(refreshed ?? null);
        if (refreshed) {
          setEditForm({
            quantity:
              refreshed.quantity !== null && refreshed.quantity !== undefined
                ? String(refreshed.quantity)
                : "",
            reserved:
              refreshed.reserved !== null && refreshed.reserved !== undefined
                ? String(refreshed.reserved)
                : "",
          });
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, baixaStock: false }));
    }
  };

  const handleProductCreateChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setProductCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductCreateToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setProductCreateForm((prev) => ({ ...prev, isActive: checked }));
  };

  const handleProductEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setProductEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductEditToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setProductEditForm((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSelectProduct = (product: StockProduct) => {
    resetMessages();
    setSelectedProduct(product);
    setProductEditForm({
      name: product.name ?? "",
      description: product.description ?? "",
      price:
        product.price !== null && product.price !== undefined
          ? String(product.price)
          : "",
      category: product.category ?? "",
      imagesJson: product.imagesJson ? JSON.stringify(product.imagesJson) : "",
      isActive: product.isActive ?? false,
    });
  };

  const parseImagesJson = (raw: string): unknown | undefined => {
    const trimmed = raw.trim();
    if (!trimmed) {
      return undefined;
    }

    try {
      return JSON.parse(trimmed);
    } catch (err) {
      throw new Error("Formato de JSON de imagens inválido.");
    }
  };

  const handleProductCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (
      !productCreateForm.name.trim() ||
      !productCreateForm.description.trim() ||
      !productCreateForm.category.trim() ||
      !productCreateForm.price.trim()
    ) {
      setError("Preencha os campos obrigatórios para cadastrar um produto.");
      return;
    }

    const price = Number(productCreateForm.price);
    if (Number.isNaN(price) || price <= 0) {
      setError("Preço deve ser um número maior que zero.");
      return;
    }

    let imagesJson: unknown | undefined;
    try {
      imagesJson = parseImagesJson(productCreateForm.imagesJson);
    } catch (err) {
      setError(getErrorMessage(err));
      return;
    }

    setActionLoading((prev) => ({ ...prev, createProduct: true }));

    try {
      await StockProductService.create({
        name: productCreateForm.name.trim(),
        description: productCreateForm.description.trim(),
        category: productCreateForm.category.trim(),
        price,
        isActive: productCreateForm.isActive,
        imagesJson,
      });

      setFeedback("Produto cadastrado com sucesso.");
      setProductCreateForm(initialProductCreateState);
      await fetchProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, createProduct: false }));
    }
  };

  const handleProductUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct || !selectedProduct.id) {
      setError("Selecione um produto para atualizar.");
      return;
    }

    resetMessages();

    if (
      !productEditForm.name.trim() ||
      !productEditForm.description.trim() ||
      !productEditForm.category.trim() ||
      !productEditForm.price.trim()
    ) {
      setError("Preencha os campos obrigatórios para atualizar o produto.");
      return;
    }

    const price = Number(productEditForm.price);
    if (Number.isNaN(price) || price <= 0) {
      setError("Preço deve ser um número maior que zero.");
      return;
    }

    let imagesJson: unknown | undefined;
    try {
      imagesJson = parseImagesJson(productEditForm.imagesJson);
    } catch (err) {
      setError(getErrorMessage(err));
      return;
    }

    setActionLoading((prev) => ({ ...prev, updateProduct: true }));

    try {
      await StockProductService.update(selectedProduct.id, {
        name: productEditForm.name.trim(),
        description: productEditForm.description.trim(),
        category: productEditForm.category.trim(),
        price,
        isActive: productEditForm.isActive,
        imagesJson,
      });

      setFeedback("Produto atualizado com sucesso.");
      const updated = await fetchProducts(true);
      const refreshed = updated.find((product) => product.id === selectedProduct.id);
      setSelectedProduct(refreshed ?? null);
      if (refreshed) {
        setProductEditForm({
          name: refreshed.name ?? "",
          description: refreshed.description ?? "",
          price:
            refreshed.price !== null && refreshed.price !== undefined
              ? String(refreshed.price)
              : "",
          category: refreshed.category ?? "",
          imagesJson: refreshed.imagesJson ? JSON.stringify(refreshed.imagesJson) : "",
          isActive: refreshed.isActive ?? false,
        });
      } else {
        setProductEditForm(initialProductEditState);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, updateProduct: false }));
    }
  };

  const handleProductDelete = async (product: StockProduct) => {
    if (!product.id) {
      setError("Não foi possível identificar o produto selecionado.");
      return;
    }

    resetMessages();

    const confirmDelete = window.confirm(
      "Tem certeza que deseja remover este produto?"
    );

    if (!confirmDelete) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, deleteProduct: true }));

    const normalizedId = typeof product.id === "string" ? product.id.trim() : String(product.id);
    const cleanId = normalizedId.replace(/^[{\["]+|[}\]"]+$/g, "").replace(/[^0-9a-fA-F-]/g, "");

    if (cleanId.length !== 36) {
      console.error("Tentativa de remover produto com ID inválido", {
        original: product.id,
        normalizedId,
        cleanId,
      });
      setError("ID do produto inválido. Atualize a página e tente novamente.");
      setActionLoading((prev) => ({ ...prev, deleteProduct: false }));
      return;
    }

    try {
      await StockProductService.delete(cleanId);
      setFeedback("Produto removido com sucesso.");

      const updated = await fetchProducts(true);
      if (selectedProduct && selectedProduct.id) {
        const selectedProductId =
          typeof selectedProduct.id === "string"
            ? selectedProduct.id.trim()
            : String(selectedProduct.id);

        const selectedCleanId = selectedProductId
          .replace(/^[{\["]+|[}\]"]+$/g, "")
          .replace(/[^0-9a-fA-F-]/g, "");

        if (cleanId === selectedCleanId) {
          const refreshed = updated.find((item) => {
            if (!item.id) return false;
            const itemId =
              typeof item.id === "string" ? item.id.trim() : String(item.id);
            const itemCleanId = itemId
              .replace(/^[{\["]+|[}\]"]+$/g, "")
              .replace(/[^0-9a-fA-F-]/g, "");
            return itemCleanId === selectedCleanId;
          });

          if (!refreshed) {
            setSelectedProduct(null);
            setProductEditForm(initialProductEditState);
          }
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, deleteProduct: false }));
    }
  };

  const totalProductPages = Math.max(1, Math.ceil(products.length / productPageSize));
  const currentProductPage = Math.min(Math.max(productPage, 1), totalProductPages);
  const productSliceStart = (currentProductPage - 1) * productPageSize;
  const visibleProducts = products.slice(
    productSliceStart,
    productSliceStart + productPageSize
  );
  const productRangeStart = products.length === 0 ? 0 : productSliceStart + 1;
  const productRangeEnd = Math.min(productSliceStart + visibleProducts.length, products.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Administração de Estoque</h1>
          <p className="mt-2 text-gray-600">
            Gerencie os itens de estoque e os produtos cadastrados. É possível cadastrar novos
            registros, ajustar quantidades e controlar o portfólio exibido para os clientes.
          </p>
        </header>

        {error && (
          <div
            ref={errorRef}
            tabIndex={-1}
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 focus:outline-none"
          >
            {error}
          </div>
        )}

        {feedback && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {feedback}
          </div>
        )}

        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Itens em estoque</h2>
              <p className="text-sm text-gray-500">
                Clique em um item para carregar os detalhes de edição.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetMessages();
                fetchItems();
              }}
              className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Atualizar lista
            </button>
          </div>

          {items.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">Nenhum item cadastrado ainda.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Armazém
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Produto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Quantidade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Reservado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Atualizado em
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((item) => {
                    const isActive =
                      selectedItem &&
                      selectedItem.product_id === item.product_id &&
                      selectedItem.warehouse_id === item.warehouse_id;

                    const updatedAt = item.updated_at
                      ? new Date(item.updated_at).toLocaleString("pt-BR")
                      : "-";

                    return (
                      <tr
                        key={`${item.warehouse_id}-${item.product_id}`}
                        className={`cursor-pointer transition hover:bg-gray-50 ${
                          isActive ? "bg-primary/5" : ""
                        }`}
                        onClick={() => handleSelectItem(item)}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {item.warehouse_id ?? "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {item.product_id ?? "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {item.quantity ?? 0}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {item.reserved ?? 0}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {updatedAt}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(item);
                            }}
                            className="rounded-md border border-red-200 px-3 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={actionLoading.deleteStock}
                          >
                            {actionLoading.deleteStock ? "Removendo..." : "Remover"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <header>
              <h2 className="text-xl font-semibold text-gray-800">Criar novo item</h2>
              <p className="text-sm text-gray-500">
                Preencha os dados para adicionar um novo item ao estoque.
              </p>
            </header>

            <form className="space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID do Produto
                </label>
                <input
                  type="text"
                  name="product_id"
                  value={createForm.product_id}
                  onChange={handleCreateChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="UUID do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID do Armazém
                </label>
                <input
                  type="text"
                  name="warehouse_id"
                  value={createForm.warehouse_id}
                  onChange={handleCreateChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="UUID do armazém"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min={0}
                    value={createForm.quantity}
                    onChange={handleCreateChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reservado
                  </label>
                  <input
                    type="number"
                    name="reserved"
                    min={0}
                    value={createForm.reserved}
                    onChange={handleCreateChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={actionLoading.createStock}
              >
                {actionLoading.createStock ? "Criando..." : "Adicionar item"}
              </button>
            </form>
          </section>

          <section className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <header>
              <h2 className="text-xl font-semibold text-gray-800">Editar item selecionado</h2>
              <p className="text-sm text-gray-500">
                Selecione um item da tabela para atualizar quantidade ou reservas.
              </p>
            </header>

            {selectedItem ? (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Produto:</span>{" "}
                  {selectedItem.product_id}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Armazém:</span>{" "}
                  {selectedItem.warehouse_id}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Quantidade atual:</span>{" "}
                  {selectedItem.quantity ?? 0}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Reservado:</span>{" "}
                  {selectedItem.reserved ?? 0}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhum item selecionado. Clique em um item da tabela para carregá-lo aqui.
              </p>
            )}

            <form className="space-y-4" onSubmit={handleUpdate}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nova quantidade
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min={0}
                    value={editForm.quantity}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={!selectedItem}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Novo reservado
                  </label>
                  <input
                    type="number"
                    name="reserved"
                    min={0}
                    value={editForm.reserved}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={!selectedItem}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={!selectedItem || actionLoading.updateStock}
              >
                {actionLoading.updateStock ? "Atualizando..." : "Salvar alterações"}
              </button>
            </form>
          </section>
        </div>

        <section className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <header>
            <h2 className="text-xl font-semibold text-gray-800">Registrar baixa de estoque</h2>
            <p className="text-sm text-gray-500">
              Utilize este formulário para descontar itens do estoque. A operação também registra a
              movimentação correspondente.
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleBaixa}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID do Produto
                </label>
                <input
                  type="text"
                  name="product_id"
                  value={baixaForm.product_id}
                  onChange={handleBaixaChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="UUID do produto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID do Armazém
                </label>
                <input
                  type="text"
                  name="warehouse_id"
                  value={baixaForm.warehouse_id}
                  onChange={handleBaixaChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="UUID do armazém"
                />
              </div>
            </div>

            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-700">
                Quantidade a baixar
              </label>
              <input
                type="number"
                name="quantity"
                min={1}
                value={baixaForm.quantity}
                onChange={handleBaixaChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={actionLoading.baixaStock}
            >
              {actionLoading.baixaStock ? "Registrando..." : "Registrar baixa"}
            </button>
          </form>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Produtos cadastrados</h2>
              <p className="text-sm text-gray-500">
                Gerencie os produtos e suas informações gerais.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetMessages();
                fetchProducts(true);
              }}
              className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Atualizar lista
            </button>
          </div>

          {products.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">Nenhum produto cadastrado até o momento.</p>
          ) : (
            <>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Categoria
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Preço
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Criado em
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {visibleProducts.map((product, index) => {
                    const isActive = selectedProduct?.id === product.id;
                    const createdAt = product.createdAt
                      ? new Date(product.createdAt).toLocaleString("pt-BR")
                      : "-";
                    const priceLabel =
                      typeof product.price === "number"
                        ? product.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : "-";

                    return (
                      <tr
                        key={product.id ?? `temp-${productSliceStart + index}`}
                        className={`cursor-pointer transition hover:bg-gray-50 ${
                          isActive ? "bg-primary/5" : ""
                        }`}
                        onClick={() => handleSelectProduct(product)}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {product.name ?? "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {product.category ?? "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {priceLabel}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {product.isActive ? (
                            <span className="font-semibold text-primary">Ativo</span>
                          ) : (
                            <span className="font-semibold text-gray-500">Inativo</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {createdAt}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleProductDelete(product);
                            }}
                            className="rounded-md border border-red-200 px-3 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={actionLoading.deleteProduct}
                          >
                            {actionLoading.deleteProduct ? "Removendo..." : "Remover"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Mostrando {productRangeStart} – {productRangeEnd} de {products.length} produtos
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevProductPage}
                    disabled={currentProductPage <= 1}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {currentProductPage} de {totalProductPages}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextProductPage}
                    disabled={currentProductPage >= totalProductPages}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <header>
              <h2 className="text-xl font-semibold text-gray-800">Cadastrar produto</h2>
              <p className="text-sm text-gray-500">
                Informe os dados principais do produto para disponibilizá-lo na vitrine.
              </p>
            </header>

            <form className="space-y-4" onSubmit={handleProductCreate}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={productCreateForm.name}
                  onChange={handleProductCreateChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Nome exibido ao cliente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={productCreateForm.description}
                  onChange={handleProductCreateChange}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Descrição detalhada"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <input
                    type="text"
                    name="category"
                    value={productCreateForm.category}
                    onChange={handleProductCreateChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preço</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    name="price"
                    value={productCreateForm.price}
                    onChange={handleProductCreateChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Imagens (JSON)
                </label>
                <textarea
                  name="imagesJson"
                  value={productCreateForm.imagesJson}
                  onChange={handleProductCreateChange}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder='Ex: ["https://..."]'
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={productCreateForm.isActive}
                  onChange={handleProductCreateToggle}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Produto ativo
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={actionLoading.createProduct}
              >
                {actionLoading.createProduct ? "Cadastrando..." : "Cadastrar produto"}
              </button>
            </form>
          </section>

          <section className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <header>
              <h2 className="text-xl font-semibold text-gray-800">
                Editar produto selecionado
              </h2>
              <p className="text-sm text-gray-500">
                Clique em um produto da lista para carregar os dados e realizar ajustes.
              </p>
            </header>

            {selectedProduct ? (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">ID:</span> {selectedProduct.id}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedProduct.isActive ? "Ativo" : "Inativo"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhum produto selecionado. Clique na tabela para carregar aqui.
              </p>
            )}

            <form className="space-y-4" onSubmit={handleProductUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={productEditForm.name}
                  onChange={handleProductEditChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={!selectedProduct}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={productEditForm.description}
                  onChange={handleProductEditChange}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={!selectedProduct}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <input
                    type="text"
                    name="category"
                    value={productEditForm.category}
                    onChange={handleProductEditChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={!selectedProduct}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preço</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    name="price"
                    value={productEditForm.price}
                    onChange={handleProductEditChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={!selectedProduct}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Imagens (JSON)
                </label>
                <textarea
                  name="imagesJson"
                  value={productEditForm.imagesJson}
                  onChange={handleProductEditChange}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={!selectedProduct}
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={productEditForm.isActive}
                  onChange={handleProductEditToggle}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  disabled={!selectedProduct}
                />
                Produto ativo
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={!selectedProduct || actionLoading.updateProduct}
              >
                {actionLoading.updateProduct ? "Atualizando..." : "Salvar alterações"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StockAdmin;
