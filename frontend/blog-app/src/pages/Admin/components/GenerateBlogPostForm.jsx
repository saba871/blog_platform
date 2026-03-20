import { useState } from 'react';
import { LuLoaderCircle } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Inputs/Input';
import { API_PATHS } from '../../../utils/apiPath';
import axiosInstance from '../../../utils/axiosInstance';

const GenerateBlogPostForm = ({
  contentParams,
  setPostContent,
  handleCloseForm,
}) => {
  const [formData, setFormData] = useState({
    title: contentParams?.title || '',
    tone: contentParams?.tone || '',
  });

  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleGeneratedBlogPost = async (e) => {
    e.preventDefault();
    const { title, tone } = formData;

    if (!title || !tone) {
      setError('Please Fill All the required Fields');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_BLOG_POST,
        {
          title,
          tone,
        }
      );

      const generatedPost = aiResponse.data;
      setPostContent({ title, content: generatedPost || '' }); // ✅ object
      handleCloseForm();
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something Went Wrong Please Try again later');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Generate a blog post</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Provide A title and tone to generate blog post
      </p>

      <form onSubmit={handleGeneratedBlogPost} className="flex flex-col gap-3">
        <Input
          value={formData.title}
          onChange={({ target }) => handleChange('title', target.value)}
          label="Blog Post Title"
          placeholder=""
          type="text"
        />

        <Input
          value={formData.tone}
          onChange={({ target }) => handleChange('tone', target.value)}
          label="Tone"
          placeholder="begginer friendly, casual, ect"
          type="text"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isloading}
        >
          {isloading && <LuLoaderCircle className="" />}{' '}
          {isloading ? 'Generating...' : 'Generate Post'}
        </button>
      </form>
    </div>
  );
};

export default GenerateBlogPostForm;
