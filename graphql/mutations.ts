import { gql } from "@apollo/client";

export const ADD_COMMENT = gql`
mutation myMutation($post_id : ID!, $username : String!, $text : String!){
    insertComment(post_id : $post_id,username: $username, text : $text)
    {
        created_at
        id
        post_id
        text
        username
    }
}
`

export const ADD_VOTE = gql`
    mutation myMutation($post_id : ID!, $username : String!, $upvote:Boolean!)
    {
        insertVote(post_id: $post_id, username:$username, upvote:$upvote)
        {
            id
            created_at
            upvote
            post_id
            username
        }
    }
`

export const  ADD_POST = gql`
    mutation myMutation(
        $body : String!
        $image : String!
        $subreddit_Id : ID!
        $title : String!
        $username: String!
    )
    {
        insertPost(
        body : $body 
        image : $image 
        subreddit_Id : $subreddit_Id
        title : $title 
        username : $username
        ){
            body  
            image  
            id
            subreddit_Id 
            title  
            username 
        }
    }
` 

export const  ADD_SUBREDDIT = gql`
mutation myMutation($topic : String!)
{
    insertSubreddit(topic:$topic)
    {
        # these fields are sent back
        id
        topic
        created_at
    }
}`