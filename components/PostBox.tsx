import { PhotoIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { LinkIcon } from '@heroicons/react/24/solid'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_ALL_POSTS, GET_SUBREDDIT_LIST_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'
type FormData ={
    postTitle: string 
    postBody: string 
    postImage: string 
    subreddit: string 
}

type Props={
    subreddit?: String
}

export default function PostBox({subreddit}:Props) {
    const {data: session} = useSession()
    {/* calling Mutation  */}
    const [addPost] = useMutation(ADD_POST, {
        refetchQueries:[GET_ALL_POSTS, 'getPostList']
    });
    const [addSubreddit] = useMutation(ADD_SUBREDDIT);

    const [imageBoxOpen, setImageBoxOpen] = useState(false)
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: {errors},
    } =useForm<FormData>()
    {/* To handle submit */}
    const onSubmit = handleSubmit(async(formData) =>{
        console.log(formData);
        const notification = toast.loading('Creating a new post...')
        try {
            const { 
                data :{getSubredditListByTopic},
            } = await client.query({
                query : GET_SUBREDDIT_LIST_BY_TOPIC,
                variables : {
                    topic : subreddit || formData.subreddit,
                },
            })

            const subredditExist = getSubredditListByTopic.length > 0;

            if(!subredditExist)
            {
                //create a subreddit
                const {data:{insertSubreddit : newSubreddit}}=await addSubreddit({
                    variables :{
                        topic : formData.subreddit
                    }
                })

                console.log("Creating a subreddit...",formData)
                const image = formData.postImage || ''

                const {data:{insertPost : newPost}}  = await addPost({
                    variables:{
                        body:formData.postBody,
                        image:image,
                        subreddit_Id:newSubreddit.id,
                        title:formData.postTitle,
                        username : session?.user?.name
                    }
                })
                console.log("New post added",newPost);
            }else{
                //use existing subreddit
                const image = formData.postImage || ''
                const {data:{insertPost : newPost}} = await addPost({
                    variables:{
                        body:formData.postBody,
                        image:image,
                        subreddit_Id:getSubredditListByTopic[0].id,
                        title:formData.postTitle,
                        username : session?.user?.name
                    }
                })
                console.log("New post added",newPost);
            }

            // After the post has been added we will reset the form data using setValue
            setValue('postBody','')
            setValue('subreddit','')
            setValue('postImage','')
            setValue('postTitle','')

            toast.success('New post created',{
                id:notification
            })
        } catch (error) {
            toast.error('Something went wrong!',{
                id:notification
            })
        }
    })
    return (
    <form onSubmit = {onSubmit} className='sticky top-20 z-50 rounded-md border border-gray-300 bg-white p-2'>
        <div className='flex items-center space-x-3'>
            {/*Avatar */}
            <Avatar/>
            <input 
            {...register('postTitle', {required:true})}
            disabled={!session} className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none" type="text" placeholder={session? subreddit? `Create a post in r/${subreddit}`:'Create a post by entering a title':'SignIn to post'} />

            <PhotoIcon onClick={()=>setImageBoxOpen(!imageBoxOpen)} className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen  && 'text-blue-300'}`}/>
            <LinkIcon className='h-6 text-gray-300 cursor-pointer'/>
        </div>

        {!!watch('postTitle') && (
            <div className='flex flex-col py-2'>
                {/* Body */}
                <div className='flex items-center px-2'>
                    <p className='min-w-[90px] '>Body : </p>
                    <input className='m-2 flex-1 bg-blue-50 p-2 outline-none'{...register('postBody')}type="text" placeholder='Text (Optional)' />
                </div>

                {/* We will hide this field if we have passsed the subreddit field in  i.e only if there is no subreddit passed then render this field*/}
                {!subreddit &&(
                    <div className='flex items-center px-2'>
                        <p className='min-w-[90px] '>Subreddit : </p>
                        <input className='m-2 flex-1 bg-blue-50 p-2 outline-none'{...register('subreddit', {required : true})}type="text" placeholder='i.e. reactjs' />
                  </div>
                )}
              

                {/* if image box is open */}
                {imageBoxOpen && (
                    <div className='flex items-center px-2'>
                        <p className='min-w-[90px] '>Image URL : </p>
                        <input className='m-2 flex-1 bg-blue-50 p-2 outline-none'{...register('postImage')}type="text" placeholder='Optional' />
                    </div>
                )}

                {/* Errors */}
                {Object.keys(errors).length > 0 && (
                    <div className='space-y-2 p-2 text-red-500'> 
                        {errors.postTitle?.type === 'required' && (
                            <p>-A Post Title is required</p>
                        )}

                        {errors.subreddit?.type === 'required' && (
                            <p>-A Subreddit is required</p>
                        )} 
                    </div>
                )}
                 {!!watch('postTitle') && <button type="submit" className='w-full rounded-full bg-blue-400 p-2 text-white'>Create Post</button> }
            </div>
        )}
    </form>
  )
}
 