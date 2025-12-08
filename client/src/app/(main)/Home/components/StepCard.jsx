import Image from "next/image"

const StepCard = ({number,title, description,imageUrl}) => {
  return (
    <div className="max-w-[48%] p-5 rounded-md border border-neutral-700 flex flex-col items-start justify-start gap-5 w-full">
         <span className="p-1 rounded-md bg-black text-xs border border-gray-600">{`Step ${number}`}</span>
         <h4 className="text-xl font-semibold">{title}</h4>
         <p className="text-neutral-400 text-sm">{description}</p>
         <Image
         src={imageUrl}
         width={100}
         height={100}
         alt="process step"
         className="w-full rounded-2xl "
         
         />
    </div>
  )
}

export default StepCard