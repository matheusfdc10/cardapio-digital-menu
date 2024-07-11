"use client"

import * as z from "zod";
import { AdditionalItem, Product } from "@/types";
import { formatterCurrencey } from "@/utils/formatterCurrency";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { useRouter } from "next/navigation";

const itemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.coerce.number(),
    amount: z.number()
})

// const categoryItemSchema = z.object({
//     id: z.string(),
//     name: z.string(),
//     description: z.string(),
//     maxQtdItems: z.number(),
//     additionalItems: z.array(itemSchema),
// })

const formSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    price: z.coerce.number(),
    comment: z.string(),
    additionalItems: itemSchema.array(),
    amount: z.number().default(1)
    // categoryItem: z.array(
    //     z.object({
    //         additionalItemCategories: categoryItemSchema,
    //         selectedItems: z.array(itemSchema)
    //     })
    // )
})

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    product: Product,
    detailsColor: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
    product,
    detailsColor
}) => {
    const router = useRouter();
    const cart = useCart();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: product && {
            // ...product,
            id: product.id,
            price: product.price,
            name: product.name,
            comment: "",
            amount: 1,
            url: product.images[0]?.url || '',
            additionalItems: [],
            // categoryItem: product.additionalItemCategories.map((additionalCategory) => ({
            //     additionalItemCategories: additionalCategory,
            //     selectedItems: []
            // })),
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: ProductFormValues) => {
        try {
            cart.addItem(data);
            router.refresh();
            router.back();
        } catch(error) {

        }
    }

    const handleAddProduct = () => {
        const amount = form.getValues('amount');
        form.setValue('amount', amount + 1);
    }

    const handleDeletProduct = () => {
        const amount = form.getValues('amount')
        if (amount > 1) {
            form.setValue('amount', amount - 1);
        }
    }

    const handleAddAdditionalItem = (item: AdditionalItem) => {
        const items = form.getValues('additionalItems')

        const hasItem = items.find((i) => i.id === item.id)

        if (hasItem) {
            form.setValue('additionalItems', [
                ...items.filter((i) => i.id !== item.id),
                {
                    ...item,
                    price: item.price * (hasItem.amount + 1),
                    amount: hasItem.amount + 1
                }
            ])
        } else {
            form.setValue('additionalItems', [
                ...items,
                {
                    ...item,
                    amount: 1
                }
            ])
        }
    }

    // console.log(form.formState.errors)

    const handleDeletAdditionalItem = (item: AdditionalItem) => {
        const items = form.getValues('additionalItems')

        const hasItem = items.find((i) => i.id === item.id)

        if (hasItem && hasItem?.amount > 1) {
            form.setValue('additionalItems', [
                ...items.filter((i) => i.id !== item.id),
                {
                    ...item,
                    price: item.price * (hasItem.amount - 1),
                    amount: hasItem.amount - 1
                }
            ])
        } else {
            form.setValue('additionalItems', [
                ...items.filter((i) => i.id !== item.id),
            ])
        }
    }

    const priceTotal = form.getValues('additionalItems').reduce((sum, item) => sum + item.price, product.price) * form.getValues('amount')

    // Calcule o total de itens adicionais selecionados para cada categoria
    const categoryTotals = product.additionalItemCategories.map((additionalCategory) => {
        const amount = additionalCategory.additionalItems.reduce((sum, item) => {
            const addedItems = form.getValues('additionalItems').find((i) => i.id === item.id);
            if (!addedItems) return sum;
            return sum + addedItems.amount;
        }, 0);
        // console.log(additionalCategory)
        return { categoryId: additionalCategory.id, total: amount, isRequired: additionalCategory.isRequired};
    });

    // Verifique se o botão "Adicionar" deve ser desativado
    const isSubmitDisabled = categoryTotals.some((categoryTotal) => {
        const additionalCategory = product.additionalItemCategories.find(
            (cat) => cat.id === categoryTotal.categoryId
        );
        if (categoryTotal.isRequired) {
            return additionalCategory && categoryTotal.total !== additionalCategory.maxQtdItems;
        }
        return additionalCategory?.isRequired
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl mx-auto flex flex-col gap-4 min-h-screen"
            >
                <div className="flex-1 space-y-4 space-y">            
                    {!!product.images.length && (
                        <div className="w-full">
                            <div className=" relative h-full w-full overflow-hidden">
                                <Image
                                    priority
                                    alt="Image"
                                    src={product?.images[0].url}
                                    width={768}
                                    height={384}
                                    className="object-cover w-full sm:max-h-96"
                                />
                            </div>
                        </div>
                    )}
                    <div className="m-4 ">
                        <div>
                            <h2 className="font-semibold text-xl leading-tight mb-2">
                                {product.name}
                            </h2>
                            <p className="mb-3 text-neutral-500 leading-5 whitespace-pre-line">
                                {product.description}
                            </p>
                            <span className="text-green-500 text-lg font-medium">
                                {formatterCurrencey.format(product.price)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 border-b">
                        {product.additionalItemCategories.map((additionalCategory) => {

                            return(
                                <div key={additionalCategory.id} className="space-y-2">
                                    <div className="bg-neutral-200 px-4 py-2 leading-2 sticky top-[4.25rem] sm:top-[4.5rem] z-40 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium">{additionalCategory.name}</h3>
                                            <p className="text-sm text-neutral-500 leading-4">{additionalCategory.description}</p>
                                            {additionalCategory.maxQtdItems > 0 && (
                                                <span className="text-xs leading-3">Escolha {!additionalCategory.isRequired && 'até'} {additionalCategory.maxQtdItems} {additionalCategory.maxQtdItems === 1 ? 'opção' : 'opções'}.</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold">
                                            {additionalCategory.isRequired ? 'Obrigatório' : "Opcional"}
                                        </span>
                                    </div>
                                    <div className="px-4 divide-y">
                                        {additionalCategory.additionalItems.map((additionalItem) => {
                                            const maxQtdItems = additionalCategory.maxQtdItems;
                                            const amount = additionalCategory.additionalItems.reduce((sum, item) => {
                                                const addedItems = form.getValues('additionalItems').find((i) => i.id === item.id)
                                                if(!addedItems) return sum
                                                return sum + addedItems.amount
                                            }, 0)

                                            const isMaximum = amount >= maxQtdItems; 

                                            return(
                                                <div key={additionalItem.id} className="flex justify-between items-center py-4">
                                                    <div>
                                                        <p className="text-sm sm:text-base">
                                                            {additionalItem.name}

                                                            {!!additionalItem.price && (
                                                                <span> + {formatterCurrencey.format(additionalItem.price)}</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {form.watch(`additionalItems`).find((i) => i.id === additionalItem.id)?.amount && (
                                                            <>
                                                                <Button
                                                                    disabled={isLoading}
                                                                    type="button" 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    onClick={() => handleDeletAdditionalItem(additionalItem)}
                                                                >
                                                                    <Minus className="w-8 h-8 text-red-500"/>
                                                                </Button>
                                                                <span>{form.watch(`additionalItems`).find((i) => i.id === additionalItem.id)?.amount}</span>
                                                            </>
                                                        )}
                                                        <Button 
                                                            disabled={isMaximum || isLoading}
                                                            type="button" 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="mr-4" 
                                                            onClick={() => handleAddAdditionalItem(additionalItem)}
                                                        >
                                                            <Plus className="w-8 h-8"style={{ color: detailsColor }}/>
                                                        </Button>
                                                    </div>
                                                </div>    
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="px-4 ">
                        <FormField 
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Algum Comentário?</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            // error={form.formState.errors.comment}
                                            disabled={isLoading}
                                            placeholder="Ex: Retirar cebola"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="sticky bottom-0 h-20 left-0 w-full bg-neutral-100 border-t z-[999]">
                    <div className="max-w-3xl mx-auto w-full h-full flex px-4 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                disabled={form.watch('amount') === 1 || isLoading}
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                onClick={handleDeletProduct}
                            >
                                <Minus className="w-8 h-8 text-red-500"/>
                            </Button>
                            <span>{form.watch('amount')}</span>
                            <Button
                                disabled={isLoading}
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="mr-4"
                                onClick={handleAddProduct}
                            >
                                <Plus className="w-8 h-8"style={{ color: detailsColor }}/>
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            className="flex justify-between gap-3 items-center"
                            style={{ backgroundColor: detailsColor}}
                            disabled={isSubmitDisabled}
                        >
                            Adicionar
                            <span>{formatterCurrencey.format(priceTotal)}</span>
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default ProductForm;