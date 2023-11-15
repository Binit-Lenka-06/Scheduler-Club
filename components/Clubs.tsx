import Image from "next/image";
import React from "react";

interface ClubProps {
    ClubImage?: string;
    ClubName: string;
    ClubFullName?: string;
    ClubDescription: string;
}

const Clubs: React.FC<ClubProps> = ({
    ClubImage,
    ClubName,
    ClubFullName,
    ClubDescription
}) => {
    return(
        <div className="card self-center">
            <div className="card-inner">
                <div className="card-front-1 w-full">
                    <div className="flex flex-col w-full gap-y-4 py-6">
                        <div className="flex justify-center text-4xl font-semibold text-neutral-200">
                            {ClubName}
                        </div>
                        <div className="px-6 h-[125px] text-overflow-clamp text-white">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur perspiciatis explicabo, quas impedit beatae debitis repudiandae minus culpa necessitatibus nobis. Cumque eveniet at corporis quos maxime dolores sed voluptas amet!
                        </div>
                    </div>
                    <div className="w-[200px] h-[200px] max-w-[300px] max-h-[300px] rounded-full border-8 border-white absolute bottom-[-20px] right-[5px] bg-cover bg-black">
                        <Image src={ClubImage || "/images/oss.svg"} alt="" className="grayscale-0 z-10 club_image" />
                    </div>
                </div>
                <div className="card-back-1">
                    <div className="flex h-fit justify-center">
                        <Image src={ClubImage || "/images/oss.svg"} alt="" className="w-[140px] py-3 club_image" />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <h3 className="text-lg font-sans">{ClubFullName}</h3>
                        <h1 className="text-neutral-300 m-0">May the Source be with you</h1>
                        <p className="px-2 text-center text-neutral-100 mt-3">{ClubDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Clubs;