import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REMOVE_POST } from '../../utils/mutations';
import { Button } from 'react-bootstrap';
import { QUERY_ME } from '../../utils/queries';
import { useParams } from 'react-router-dom';


const PostList = ({ posts, user }) => {

    const userParam = useParams();

    const isEmpty = Object.keys(userParam).length === 0;


    const [removePost] = useMutation(REMOVE_POST, {
        update(cache, { data: { removePost } }) {

            try {
                const { me } = cache.readQuery({ query: QUERY_ME });

                cache.writeQuery({
                    query: QUERY_ME,
                    data: { me: { ...me, posts: [...me.posts.filter((post) => post._id !== removePost._id)] } }
                })
            } catch (e) {
                console.warn('Removal failed')
            }

        }
    });

    if (!posts || !posts.length) {
        return (
            <>
                <p className='conditional-title'>No items on the curb!</p>;
            </>
        )
    }

    const handleDelete = async (postId) => {
        try {
            await removePost({
                variables: { _id: postId }
            });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <div className='user-profile-subtitle'>
                <h2>{`${user}'s posts`}</h2>
            </div>
            <div className="feed">
                {' '}
                {posts &&
                    posts.map(post => (

                        < Card key={post._id} id="feed-item" className="flex-center" >
                            <Link to={`/post/${post._id}`}>
                                <Card.Title>{post.itemTitle}</Card.Title>
                                <Card.Img id="card-img"
                                    variant="top" src={post.imageURL}
                                />
                            </Link>
                            {isEmpty && <Button id="delete-button" onClick={() => handleDelete(post._id)}>Delete Post</Button>}
                        </Card >
                    ))
                }
            </div>
        </div>
    )
}


export default PostList;