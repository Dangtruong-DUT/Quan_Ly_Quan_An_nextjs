import nextRequestDishesApi from "@/api/nextToBackend/dishes";
import { WrapperServerCallApi } from "@/utils/common";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const data = await WrapperServerCallApi({
        apiCallFn: () => nextRequestDishesApi.nextList(),
    });
    const dishes = data?.payload.data;

    return (
        <div className="w-full space-y-4">
            <div className="relative">
                <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-8"></span>
                <Image
                    src="/banner.png"
                    width={400}
                    height={200}
                    quality={100}
                    alt="Banner"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="z-9 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
                    <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">
                        Nhà hàng Big Boy
                    </h1>
                    <p className="text-center text-sm sm:text-base mt-4 text-white">Vị ngon, trọn khoảnh khắc</p>
                </div>
            </div>
            <section className="space-y-10 py-16">
                <h2 className="text-center text-2xl font-bold ">Đa dạng các món ăn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {dishes &&
                        dishes.map((dish) => (
                            <Link key={dish.id} href={`/dishes/${dish.id}`} className="group">
                                <div className="flex gap-4 w" key={dish.id}>
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={dish.image || "/placeholderimage.webp"}
                                            width={150}
                                            height={150}
                                            className="object-cover w-[150px] h-[150px] rounded-md"
                                            alt={dish.name}
                                            quality={100}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold">{dish.name}</h3>
                                        <p className="">{dish.description}</p>
                                        <p className="font-semibold">{formatCurrency(dish.price)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}{" "}
                </div>
            </section>
        </div>
    );
}
