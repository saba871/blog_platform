import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import CommentInCard from '../../components/Cards/CommentInCard'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import toast from 'react-hot-toast'
import Modal from '../../components/Modal'
import DeleteAlertContent from '../../components/DeleteAlertContent'

const Comments = () => {
    const navigate = useNavigate()
    const [comments, setComments] = useState([])

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        open: false,
        data: null,
    })

    // get all comments
    const getAllComments = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.COMMENTS.GET_ALL)
            setComments(response.data?.length > 0 ? response.data : [])
        } catch (error) {
            console.error('Error Fetching Data: ', error)
        }
    }

    // delete all comments
    const deleteComments = async (commentId) => {
        try {
            await axiosInstance.delete(API_PATHS.COMMENTS.DELETE(commentId))
            toast.success('Comment Deleted Succsesfully')
            setOpenDeleteAlert({
                open: false,
                data: null,
            })
            getAllComments()
        } catch (error) {
            console.error('error deleting blog post: ', error)
        }
    }

    useEffect(() => {
        getAllComments()
        return () => {}
    }, [])
    return (
        <DashboardLayout activeMenu="Comments">
            <div className="w-auto sm:max-w-[900px] mx-auto">
                <h2 className="text-2xl font-semibold mt-5 mb-5">Comments</h2>

                {comments.map((comment) => (
                    <CommentInCard
                        key={comment._id}
                        commentId={comment._id || null}
                        authorName={comment.author.name}
                        authorPhoto={comment.author.profileImageUrl}
                        content={comment.content}
                        updatedOn={
                            comment.updatedAt
                                ? moment(comment.updatedAt).format(
                                      'Do MMM YYYY',
                                  )
                                : '-'
                        }
                        post={comment.post}
                        postId={comment.post?._id || comment.post}
                        replies={comment.replies || []}
                        getAllComments={getAllComments}
                        onDelete={(commentId) => {
                            setOpenDeleteAlert({
                                open: true,
                                data: commentId || comment._id,
                            })
                        }}
                    />
                ))}
            </div>

            <Modal
                isOpen={openDeleteAlert?.open}
                onClose={() => {
                    setOpenDeleteAlert({ open: false, data: null })
                }}
                title="Delete Alert"
            >
                <div className="">
                    <DeleteAlertContent
                        content="are you sure you want to delete this comment?"
                        onDelete={() => deleteComments(openDeleteAlert.data)}
                    />
                </div>
            </Modal>
        </DashboardLayout>
    )
}

export default Comments
