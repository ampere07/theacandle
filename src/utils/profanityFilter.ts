// List of words to filter
const profanityList = [
    'bullshit',
    'fuck',
    'shit',
    'damn',
    'ass',
    // Add more words as needed
  ];

  export const filterComment = (comment: string): string => {
    let filteredComment = comment.toLowerCase();

    profanityList.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      filteredComment = filteredComment.replace(regex, '#'.repeat(word.length));
    });

    return filteredComment;
  };