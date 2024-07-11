"use client"

import * as z from "zod";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { formatterCurrencey } from "@/utils/formatterCurrency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import axios from 'axios'
import { Restaurant } from "@/types";

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Preencha seu nome"
    }),
    phone: z.coerce.number().min(11).max(11),
    email: z.string().email(),
    formPayment: z.enum(["", "Catão Débito", "Crtão Crédito", "Pix", "Dinheiro"]),
    isNeedCashChange: z.enum([ "Sim", "Não",]),
    changeInCash: z.coerce.number().min(1),
    address: z.object({
        streetAddress: z.string().min(1, {
            message: "Preenche o endereço"
        }),
        number: z.coerce.number().min(1, {
            message: "Preenche o número"
        }),
        complement: z.string(),
        neighborhood: z.string().min(1, {
            message: "Preenche a bairro"
        }),
        city: z.string().min(1, {
            message: "Preenche a cidade"
        }),
        state: z.string().min(2, {
            message: "Preenche o estado"
        }).max(2, {
            message: "Máximo 2 caracteres"
        }),
        zipCode: z.coerce.number().min(9999999, {
            message: "Preenche o CEP"
        }).max(99999999, {
            message: "CEP inválido"
        })
    }),
})

type OrderFormValues = z.infer<typeof formSchema>;

enum STEPS {
    ADDRESS = 0,
    DATACLIENT = 1,
    FORMPAYMENT = 2,
    SUMMARY = 3,
}

interface OrderModalProps {
    open: boolean;
    setOpen: () => void;
    restaurant: Restaurant
}

const OrderModal: React.FC<OrderModalProps> = ( {
    open,
    setOpen,
    restaurant
}) => {
    const [step, setStep] = useState(STEPS.ADDRESS)
    const items = useCart((state) => state.items);
    const cart = useCart();

    const totalPrice = items.reduce((total, item) => {
        const totalProduct = item.additionalItems.reduce((sum, i) => sum + i.price, item.price) * item.amount;

        return total + totalProduct;
    }, 0)

    const form = useForm<OrderFormValues>({
        // resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: undefined,
            email: "",
            formPayment: "",
            isNeedCashChange: "Sim",
            changeInCash: undefined,
            address: {
                streetAddress: "",
                city: "",
                complement: "",
                zipCode: undefined,
                state: "",
                neighborhood: "",
                number: undefined,
            },
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onBack = () => {
        setStep((value) => value - 1);
    }

    const onNext = () => {
        setStep((value) => value + 1);
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.SUMMARY) {
            return 'Pedir';
        }

        return 'Próximo';
    }, [step])

    // console.log(form.formState.errors)
    const formPaymentText = `${form.getValues('formPayment') === "Dinheiro" ? `${form.getValues('formPayment')} - ${form.getValues('isNeedCashChange') === 'Sim' ? `troco para ${formatterCurrencey.format(form.getValues('changeInCash'))}` : 'sem troco'}` : form.getValues('formPayment')}`;
    const itemsText = items.map((item) => {
        return `* ${item.amount}x ${item?.name}${item.additionalItems.map((additional, index) => {
            if(index === 0) {
                return ` - ${additional.amount}x ${additional.name}`
            } else {
                return `${additional.amount}x ${additional.name}`
            }
        }).join(", ")}${item.comment && `, *Observação:* ${item.comment}`}.`
    }).join("%0a");
    const nameText = form.watch("name");
    const phoneText = `${form.watch("phone")}`;
    const emailText = form.watch("email");
    const addressText = `${form.getValues('address.streetAddress')}, ${form.getValues('address.number')}, ${form.getValues('address.complement') && `${form.getValues('address.complement')},`} ${form.getValues('address.neighborhood')} - ${form.getValues('address.city')}/${form.getValues('address.state')}`

    // console.log(`${itemsText}`)

    const onSubmit = async (data: OrderFormValues) => {
        if (step !== STEPS.SUMMARY) {
            return onNext();
        }
        try {
            const date = new Date()
            const codding = `${date.getHours()}${date.getMinutes()}${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${extractAmount(totalPrice)}`
            // window.location.assign(`https://wa.me/55${restaurant.whatsapp}/?text=*%23%20${codding}*%0a%0a*Pedido🍴*%0a${itemsText}%0a%0a*SubTotal:* ${formatterCurrencey.format(totalPrice)}%0a*Taxa de entrega:* Grátis%0a*Total:* ${formatterCurrencey.format(totalPrice)}%0a%0a*Forma de pagamento:*%0a${formPaymentText}%0a%0a*Nome:* ${nameText}%0a*Celular:* ${phoneText}%0a*Email:* ${emailText}%0a%0a*Endereço:*%0a${addressText}`)
            // const message = `*%23%20${codding}*%0a%0a*Pedido🍴*%0a${itemsText}%0a%0a*SubTotal:* ${formatterCurrencey.format(totalPrice)}%0a*Taxa de entrega:* Grátis%0a*Total:* ${formatterCurrencey.format(totalPrice)}%0a%0a*Forma de pagamento:*%0a${formPaymentText}%0a%0a*Nome:* ${nameText}%0a*Celular:* ${phoneText}%0a*Email:* ${emailText}%0a%0a*Endereço:*%0a${addressText}`

            const message = `*#${codding}*\n\n*Pedido🍴*\n${itemsText}\n\n*SubTotal:* ${formatterCurrencey.format(totalPrice)}\n*Taxa de entrega:* Grátis\n*Total:* ${formatterCurrencey.format(totalPrice)}\n\n*Forma de pagamento:*\n${formPaymentText}\n\n*Nome:* ${nameText}\n*Celular:* ${phoneText}\n*Email:* ${emailText}\n\n*Endereço:*\n${addressText}`
            window.location.href = (`https://api.whatsapp.com/send?phone=55${restaurant.whatsapp}&text=${encodeURIComponent(message)}`)
            cart.removeAll(); 
            // cart.addItem(data);
            // router.refresh();
            // router.back();
        } catch(error) {

        }
    }

    function haversineDistance(lat1: any, lon1: any, lat2: any, lon2: any) {
        const R = 6371; // Raio médio da Terra em quilômetros
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
      }

    const handleGetAddress = async (cep: string) => {
        if (cep.length === 8) {
            try {
                const response1 = await axios.get(`https://brasilapi.com.br/api/cep/v2/${restaurant.address.zipCode}`)

                const response2 = await (await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`))
                // console.log(restaurant.deliveryDistance)
                if (haversineDistance(response1.data.location.coordinates.latitude, response1.data.location.coordinates.longitude, response2.data.location.coordinates.latitude, response2.data.location.coordinates.longitude) > restaurant.deliveryDistance) {
                    return toast({
                        variant: "destructive",
                        description: "Não atendemos neste endereço.",
                    });
                }
                
                form.setValue('address.streetAddress', response2.data.street)
                form.setValue('address.neighborhood', response2.data.neighborhood)
                form.setValue('address.city', response2.data.city)
                form.setValue('address.state', response2.data.state)
            } catch(error) {
                toast({
                    variant: "destructive",
                    description: "Endereço não encontrado.",
                });
            }
        } else {
            form.setValue('address.streetAddress', '')
            form.setValue('address.neighborhood', '')
            form.setValue('address.city', '')
            form.setValue('address.state', '')
        }
        form.trigger();
    }

    // axios.get()
    
    return (
        <Modal
            isOpen={open}
            onClose={setOpen}
            title="Pedido"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {step === STEPS.ADDRESS && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                <FormField 
                                    control={form.control}
                                    name="address.zipCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CEP</FormLabel>
                                            <FormControl>
                                                <Input
                                                    error={form.formState.errors.address?.zipCode}
                                                    type="number"
                                                    disabled={isLoading}
                                                    placeholder="Ex: 99999999"
                                                    {...field}
                                                    {...form.register(field.name, { required: true, minLength: 8, maxLength: 8, valueAsNumber: true })}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        handleGetAddress(e.target.value)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                <FormField 
                                    control={form.control}
                                    name="address.streetAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Endereço</FormLabel>
                                            <FormControl>
                                                <Input
                                                    error={form.formState.errors.address?.streetAddress}
                                                    disabled
                                                    placeholder="Ex: Rua São João"
                                                    {...field}
                                                    {...form.register(field.name, { required: true })}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField 
                                    control={form.control}
                                    name="address.number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número</FormLabel>
                                            <FormControl>
                                                <Input
                                                    error={form.formState.errors.address?.number}
                                                    type="number"
                                                    disabled={isLoading}
                                                    placeholder="Ex: 101"
                                                    {...field}
                                                    {...form.register(field.name, { required: true, valueAsNumber: true, onChange: () => form.trigger(), })}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            <FormField 
                                control={form.control}
                                name="address.complement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complemento</FormLabel>
                                        <FormControl>
                                            <Input
                                                error={form.formState.errors.address?.complement}
                                                disabled={isLoading}
                                                placeholder="Ex: Casa 1"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="address.neighborhood"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bairro</FormLabel>
                                        <FormControl>
                                            <Input
                                                error={form.formState.errors.address?.neighborhood}
                                                disabled
                                                placeholder="Ex: Vila Velha"
                                                {...field}
                                                {...form.register(field.name, { required: true })}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="address.city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input
                                                error={form.formState.errors.address?.city}
                                                disabled
                                                placeholder="Ex: Rio de Janeiro"
                                                {...field}
                                                {...form.register(field.name, { required: true })}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="address.state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input
                                                error={form.formState.errors.address?.state}
                                                disabled
                                                placeholder="Ex: RJ"
                                                {...field}
                                                {...form.register(field.name, { required: true, maxLength: 2 })}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            </div>
                        </>
                    )}

                    {step === STEPS.DATACLIENT && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                error={form.formState.errors.name}
                                                disabled={isLoading}
                                                placeholder="Informe seu nome"
                                                {...field}
                                                {...form.register(field.name, { required: true})}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                error={form.formState.errors.email}
                                                disabled={isLoading}
                                                placeholder="Informe seu email"
                                                {...field}
                                                {...form.register(field.name, { required: true })}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Celular</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                error={form.formState.errors.phone}
                                                disabled={isLoading}
                                                placeholder="Ex: 21 999999999"
                                                {...field}
                                                {...form.register(field.name, { required: true, maxLength: 11, minLength: 11, valueAsNumber: true})}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {step === STEPS.FORMPAYMENT && (
                        <div className="w-full">
                            <span className="text-lg font-semibold">Valor total {formatterCurrencey.format(totalPrice)}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4">
                                <FormField 
                                    control={form.control}
                                    name="formPayment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Forma de pagamento</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                                {...form.register(field.name, { required: true})}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma opção" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Cartão de crédito">Cartão de crédito</SelectItem>
                                                    <SelectItem value="Cartão de débito">Cartão de débito</SelectItem>
                                                    <SelectItem value="Pix">Pix</SelectItem>
                                                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                                <FormField 
                                    control={form.control}
                                    name="isNeedCashChange"
                                    render={({ field }) => (
                                        <FormItem className={form.watch("formPayment") === "Dinheiro" ? "block" : "hidden"}>
                                            <FormLabel>Precisa de troco?</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                                {...form.register(field.name, { required: form.watch("formPayment") === "Dinheiro" })}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Precisa de troco?" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Sim">Sim</SelectItem>
                                                    <SelectItem value="Não">Não</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="changeInCash"
                                    render={({ field }) => (
                                        <FormItem className={form.watch("isNeedCashChange") === "Sim" && form.watch("formPayment") === "Dinheiro" ? "block" : "hidden"}>
                                            <FormLabel>Troco para? R$</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    error={form.formState.errors.changeInCash}
                                                    disabled={isLoading}
                                                    placeholder="Ex: 20"
                                                    {...field}
                                                    {...form.register(field.name, { required: form.watch("isNeedCashChange") === "Sim" && form.watch("formPayment") === "Dinheiro",  valueAsNumber: true, min: totalPrice})}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {step === STEPS.SUMMARY && (
                        <div>
                            <h1 className="text-lg font-semibold">Resumo do pedido</h1>
                            <div>
                                {items.map((item) => (
                                    <div 
                                        key={item.id}
                                        className="border-b py-1"
                                    >
                                        <h3>{item.amount}x {item.name}</h3>
                                        <p
                                            className="text-sm text-neutral-500"
                                        >{item.additionalItems.map((item, i) => {
                                            if (i) {
                                                return `, ${item.amount}x ` + item.name 
                                            } else {

                                                return `${item.amount}x ` + item.name 
                                            }
                                        })}</p>
                                        {item.comment && (
                                            <div>
                                                <h4>Observação:</h4>
                                                <p className="text-sm text-neutral-500">{item.comment}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <p><strong>Nome:</strong> {form.getValues("name")}</p>
                                <p><strong>Celular:</strong> {form.getValues("phone")}</p>
                                <p><strong>Email:</strong> {form.getValues("email")}</p>
                                <p><strong>Endereço:</strong> {form.getValues('address.streetAddress')}, {form.getValues('address.number')}, {form.getValues('address.complement') && `${form.getValues('address.complement')},`} {form.getValues('address.neighborhood')} - {form.getValues('address.city')}/{form.getValues('address.state')}</p>
                                <p><strong>Forma de pagamento:</strong> {form.getValues('formPayment') === "Dinheiro" ? `${form.getValues('formPayment')} - ${form.getValues('isNeedCashChange') === 'Sim' ? `troco para ${formatterCurrencey.format(form.getValues('changeInCash'))}` : 'sem troco'}` : form.getValues('formPayment')}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end items-center gap-5 flex-wrap pt-4">
                        {step !== STEPS.ADDRESS && (
                            <Button
                                type="button"
                                disabled={isLoading}
                                variant="destructive"
                                onClick={onBack}
                            >
                                Voltar
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {actionLabel}
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    )
}

export default OrderModal;


function extractAmount(value: number) {
    const stringValue = value.toFixed(2); // Converte o número para string com duas casas decimais
    const digitsOnly = stringValue.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    return parseInt(digitsOnly, 10); // Converte a string de volta para um número inteiro
}