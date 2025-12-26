
"use client"
import { WidgetView } from "@/modules/widget/ui/views/widget-view";
import { use } from "react";

interface Props{
  searchParams:Promise<{
    orgnizationId:string;
  }>
};


const Page = ({searchParams}:Props) =>{
  const {orgnizationId} = use(searchParams);
  return (
    <WidgetView orgnizationId={orgnizationId}/>
  )

};

export default Page;
