import * as React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog';

export function MorphCard({ image, name, desc }: { image:string, name:string, desc:string }){
    return(
        <MorphingDialog
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 24,
            }}
            >
            <MorphingDialogTrigger
                style={{
                borderRadius: '4px',
                }}
                className=''
            >
                <div className='flex flex-col items-center relative overflow-hidden'>
                    <MorphingDialogImage
                        src={image}
                        alt={`${name}, ${image}`}
                        className='md:h-75 md:w-45 h-65 w-35 object-cover object-top'
                        style={{
                            borderRadius: '4px',
                        }}
                    />
                    <div className='flex flex-col absolute bottom-0 z-3 w-full items-end justify-center space-y-0'>
                        <MorphingDialogTitle className=' font-medium text-white text-xl'>
                            {name}
                        </MorphingDialogTitle>
                    </div>
                    <div className={` absolute -bottom-10 -rotate-15 w-[120%] h-20 z-2 bg-black`}></div>
                </div>
            </MorphingDialogTrigger>
            <MorphingDialogContainer>
                <MorphingDialogContent
                    style={{
                        borderRadius: '12px',
                    }}
                    className='relative h-auto w-[500px] border bg-black'
                >
                    <ScrollArea className='h-[75vh]' type='scroll'>
                        <div className='relative p-6'>
                        <div className='flex justify-center py-10'>
                            <MorphingDialogImage
                                src={image}
                                alt={`${name}, ${image}`}
                                className='h-auto w-[200px]'
                            />
                        </div>
                        <div className=''>
                            <MorphingDialogTitle className='text-white text-2xl'>
                                {name}
                            </MorphingDialogTitle>
                            <div className='mt-4 text-sm text-gray-300'>
                                <p>
                                    {desc}
                                </p>
                            </div>
                        </div>
                        </div>
                    </ScrollArea>
                <MorphingDialogClose className='text-zinc-500' >
                    <Button className={`bg-red-400 px-10`}>ปิด</Button>
                </MorphingDialogClose>
                </MorphingDialogContent>
            </MorphingDialogContainer>
        </MorphingDialog>
    )
}
