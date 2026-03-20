export const getInitials = (title) => {
  if (!title) return "";
  const words = title.split(" ").filter(Boolean);

  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    if (words[i][0]) {
      initials += words[i][0];
    }
  }

  return initials.toUpperCase();
}



export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


export const getToastMessageByType = (type) => {
  switch(type) {
    case "edit":
      return 'Blog Post Updated Successfully';
    case "draft":
      return 'Blog Post saved as Draft By Successfully'
    case "published":
      return 'Blog Post published Successfully';
  }
}



export const sanitizeMarkdown = (content) =>
{
  const markdownBlockRegex = /^```(?:markdown)?\n([\s\S]*?)\n```$/;
  const match = content.match(markdownBlockRegex);
  return match ? match[1] : content;
}