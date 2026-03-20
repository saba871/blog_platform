import MDEditor, { commands } from '@uiw/react-md-editor';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  LuLoaderCircle,
  LuSave,
  LuSend,
  LuSparkles,
  LuTrash2,
} from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import BlogPostIdeaCard from '../../components/Cards/BlogPostIdeaCard';
import DeleteAlertContent from '../../components/DeleteAlertContent';
import CoverImageSelector from '../../components/Inputs/CoverImageSelector';
import TagInputs from '../../components/Inputs/TagInputs';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import SkeletonLoader from '../../components/Loader/SkeletonLoader';
import Modal from '../../components/Modal';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import { getToastMessageByType } from '../../utils/helper';
import uploadImage from '../../utils/uploadImage';
import GenerateBlogPostForm from './components/GenerateBlogPostForm';

const BlogPostEditor = ({ isEdit }) => {
  const navigate = useNavigate();
  const { postSlug = '' } = useParams();

  const [postData, setPostData] = useState({
    id: '',
    title: '',
    content: '',
    coverImageUrl: '',
    coverPreview: '',
    tags: [],
    isDraft: '',
    generatedByAi: false,
  });

  const [postIdeas, setPostIdeas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [openBlogPostGenForm, setOpenBlogPostGenForm] = useState({
    open: false,
    data: null,
  });

  const [ideaLoading, setIdeaLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setPostData(prevData => ({ ...prevData, [key]: value }));
  };

  const generatePostIdeas = async () => {
    setIdeaLoading(true);
    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_BLOG_POST_IDEAS,
        {
          topics: 'React Js, Node JS, Mern',
        }
      );
      const generateIdeas = aiResponse.data;
      if (generateIdeas?.length > 0) {
        setPostIdeas(generateIdeas);
      }
    } catch (error) {
      console.log('Something Went Wrong Please Try Again Later');
    } finally {
      setIdeaLoading(false);
    }
  };

  const handlePublish = async isDraft => {
    let coverImgUrl = '';

    if (!postData.title.trim()) {
      setError('Please Enter a Title');
      return;
    }

    if (!postData.content.trim()) {
      setError('Please Enter a Content');
      return;
    }

    if (!isDraft) {
      if (!isEdit && !postData.coverImageUrl) {
        setError('Please Select a Cover Image');
        return;
      }
      if (isEdit && !postData.coverImageUrl && !postData.coverPreview) {
        setError('Please Select a Cover Image');
        return;
      }
      if (!postData.tags.length) {
        setError('Please Add Some Tags');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // Check if a new image was uploaded (File type)
      if (postData.coverImageUrl instanceof File) {
        const imgUploadRes = await uploadImage(postData.coverImageUrl);
        coverImgUrl = imgUploadRes.imageUrl || '';
      } else {
        coverImgUrl = postData.coverImageUrl || postData.coverPreview || '';
      }

      const reqPayload = {
        title: postData.title,
        content: postData.content,
        coverImageUrl: coverImgUrl,
        tags: postData.tags,
        isDraft: isDraft ? true : false,
        generatedByAi: true,
      };

      const response = isEdit
        ? await axiosInstance.put(
            API_PATHS.POSTS.UPDATE(postData.id),
            reqPayload
          )
        : await axiosInstance.post(API_PATHS.POSTS.CREATE, reqPayload);

      if (response.data) {
        toast.success(
          getToastMessageByType(
            isDraft ? 'draft' : isEdit ? 'edit' : 'published'
          )
        );
        navigate('/admin/posts');
      }
    } catch (error) {
      setError('Feiled To Publish Blog Post. Please Try Again');
      console.error('Error Publishing blog post: ', error);
    } finally {
      setLoading(false);
    }
  };

  // fetch blog post by slug
  const fetchPostDataBySlug = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_BY_SLUG(postSlug))
      if (response.data) {
        const data = response.data

        setPostData((prevState) => ({
          ...prevState,
          id: data._id,
          title: data.title,
          content: data.content,
          coverPreview: data.coverImageUrl,
          tags: data.tags,
          isDraft: data.isDraft,
          generatedByAi: data.generatedByAI
        }))
      }
    } catch (error) {
      console.log("Error: ", error)
    }
  };


  const deletePost = async () => {
    try {
      const response = await axiosInstance.delete(API_PATHS.POSTS.DELETE(postData.id))
      toast.success("Blog Post deleted succsesfully")
      setOpenDeleteAlert(false)
      navigate("/admin/posts")
    } catch (error) {
      console.log("Error Deleting Blog Post: ", error)
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchPostDataBySlug();
    } else {
      generatePostIdeas();
    }
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Blog Posts">
      <div className="my-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4">
          <div className="form-card p-6 col-span-12 md:col-span-8">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-medium">
                {isEdit ? 'Edit Post' : 'Add New Post'}
              </h2>

              <div className="flex items-center gap-3">
                {isEdit && (
                  <button
                    className="flex items-center gap-2.5 text-[13px] font-medium text-rose-500 bg-rose-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-rose-50 hover:border-rose-300 cursor-pointer hover:scale-[1.02] transition-all"
                    disabled={loading}
                    onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash2 className="text-sm" /> <span>Delete</span>
                  </button>
                )}

                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sky-500 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-sky-100 hover:border-sky-400 cursor-pointer hover:scale-[1.02] transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(true)}
                >
                  <LuSave className="text-sm" /> <span>Save As Draft</span>
                </button>

                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sky-600 hover:text-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 rounded px-3 py-[3px] border border-sky-500 hover:border-sky-50 cursor-pointer transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(false)}
                >
                  {loading ? (
                    <LuLoaderCircle className="animate-spin text-[15px]" />
                  ) : (
                    <LuSend className="text-sm" />
                  )}{' '}
                  Publish
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Post Title
              </label>
              <input
                className="form-input"
                placeholder="How To Build Mern App"
                value={postData.title}
                onChange={({ target }) =>
                  handleValueChange('title', target.value)
                }
              />
            </div>

            <div className="mt-4">
              <CoverImageSelector
                image={postData.coverImageUrl}
                setImage={value => handleValueChange('coverImageUrl', value)}
                preview={postData.coverPreview}
                setPreview={value => handleValueChange('coverPreview', value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-gray-600">
                Content
              </label>

              <div data-color-mode="light" className="mt-3">
                <MDEditor
                  value={postData.content}
                  onChange={data => handleValueChange('content', data)}
                  preview="edit"
                  commands={[
                    commands.bold,
                    commands.italic,
                    commands.strikethrough,
                    commands.hr,
                    commands.title,
                    commands.divider,
                    commands.link,
                    commands.code,
                    commands.image,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                    commands.checkedListCommand,
                  ]}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Tags</label>
              <TagInputs
                tags={postData?.tags || []}
                setTags={data => handleValueChange('tags', data)}
              />
            </div>
          </div>

          {!isEdit && (
            <div className="form-card col-span-12 md:col-span-4 p-0">
              <div className="flex items-center justify-between px-6 pt-6">
                <h4 className="text-xs md:text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap">
                  <span className="text-sky-600">
                    <LuSparkles />
                  </span>
                  Ideas For Your Next Post
                </h4>
                <button
                  className="bg-gradient-to-r from-sky-500 to-cyan-400 text-[13px] font-semibold text-white px-2.5 py-1 rounded hover:opacity-80 transition-all cursor-pointer whitespace-nowrap ml-2"
                  onClick={() =>
                    setOpenBlogPostGenForm({ open: true, data: null })
                  }
                >
                  Generate Now
                </button>
              </div>

              <div>
                {ideaLoading ? (
                  <div className="p-5">
                    <SkeletonLoader />
                  </div>
                ) : (
                  postIdeas.map((idea, index) => (
                    <BlogPostIdeaCard
                      key={`idea_${index}`}
                      title={idea.title || ''}
                      description={idea.description || ''}
                      tags={idea.tags || []}
                      tone={idea.tone || 'casual'}
                      onSelect={() =>
                        setOpenBlogPostGenForm({ open: true, data: idea })
                      }
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

        <Modal
          isOpen={openBlogPostGenForm?.open}
          onClose={() => {
            setOpenBlogPostGenForm({ open: false, data: null });
          }}
          hideHeader
        >
          <GenerateBlogPostForm
            contentParams={openBlogPostGenForm?.data || null}
            setPostContent={({ title, content }) => {
              const postInfo = openBlogPostGenForm?.data || null;
              setPostData(prevState => ({
                ...prevState,
                title: title || prevState.title,
                content: content,
                tags: postInfo?.tags || prevState.tags,
                generatedByAI: true,
              }));
            }}
            handleCloseForm={() => {
              setOpenBlogPostGenForm({ open: false, data: null });
            }}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert}
          onClose={() => {
            setOpenDeleteAlert(false)
          }}
          title="Delete Alert"
        >
          <div className='w-[30vw]'>
            <DeleteAlertContent
              content="Are You Sure You want to delete this post"
              onDelete={() => deletePost()}
            />
          </div>
        </Modal>
    </DashboardLayout>
  );
};

export default BlogPostEditor;
