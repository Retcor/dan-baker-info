import React, { useState } from "react";
import { motion } from "framer-motion";
import { v4 } from 'uuid'
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SERVER_PREFIX } from "../App.jsx";
import AudioStreamPlayer from "./AudioStreamPlayer.jsx";
import LoadingSpinner from "./icons/LoadingSpinner.jsx";

const StoryBook = () => {
  const [storyBookPages, setStoryBookPages] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState('');
  const [percentage, setPercentage] = useState(0);

  const handleClose = () => {
    setConfirmOpen(false);
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleClearClick = () => {
    setPrompt('');
  };

  const handleGenerateStory = async (e) => {
    if (storyBookPages.length) {
      setConfirmOpen(true)
    } else {
      await getGPTResponse()
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await handleGenerateStory()
    }
  };

  const getGPTResponse = async () => {
    setLoading(true)
    setStoryBookPages([])
    setConfirmOpen(false)
    try {
      setLoadingDescription(`Generating story...`)
      const res = await fetch(`${SERVER_PREFIX}/chat/gpt/prompt?prompt=${prompt}`)
      const reply = await res.text()
      const replyArr = reply.split('\n').filter(i => i)

      // Average time to generate all images is 5 seconds plus a 1 second for each image, minus 1
      const durationInSeconds = 5 + replyArr.length - 1
      const intervalTime = Math.floor((durationInSeconds * 1000) / 100); // Interval time for each 1% progress
      const interval = setInterval(() => {
        setPercentage((prevPercentage) => {
          const newPercentage = prevPercentage + 1
          if (newPercentage >= 100) {
            clearInterval(interval)
          }
          return newPercentage
        });
      }, intervalTime)

      setLoadingDescription(`Generating image${replyArr.length > 1 ? 's' : ''}...`)
      const replyImgArr = await Promise.all(replyArr.map(async i => {
        const imageRes = await fetch(`${SERVER_PREFIX}/chat/gpt/image/prompt?prompt=${i}`)
        const image = await imageRes.text()
        return {
          id: v4(),
          reply: i,
          image
        }
      }))
      clearInterval(interval)
      setPercentage(0)
      setStoryBookPages(replyImgArr)
    } catch (ex) {
      console.log(ex)
    }
    setLoading(false)
  };

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Just some fun with AI</p>
        <h3 className={styles.sectionHeadText}>Story Book</h3>
        <p className={styles.sectionTinyText}>
          Story Book uses Dall-E, ChatGPT 3.5 and Play.ht APIs
          to generate random Story Books with AI generated text,
          images and voice cloning.  This allows for a fun and
          creative way to read all new types of stories to your kids.
          It can even read the story to them in a voice of their choosing,
          whether that be Mickey Mouse, Optimus Prime or even one of their
          loved ones!
        </p>

        <div className="mt-12 flex flex-col gap-8">
          {confirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-primary w-96 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
                <p className="mb-4">
                  Are you sure you want to generate a new story? This will replace the current story.
                </p>
                <div className="flex justify-end">
                  <button className="mr-2 px-4 py-2 text-white bg-gray-500 rounded" onClick={handleClose}>
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-white bg-blue-500 rounded"
                    onClick={getGPTResponse}
                    disabled={loading}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="relative flex flex-col">
            <input
              style={{ width: '100%' }}
              type="text"
              placeholder="What story would you like to hear about today?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              onKeyDown={handleKeyDown}
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              disabled={loading}
            />
            {prompt && (
              <div className="absolute right-3 bottom-4 flex items-center">
                <button
                  className="mr-2 text-gray hover:text-red-500"
                  onClick={handleClearClick}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  className="text-gray hover:text-blue-500"
                  onClick={handleGenerateStory}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner /> : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        {loading && (
          <div>
            <br/>
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium text-blue-700 dark:text-white">{loadingDescription}</span>
              <span className="text-sm font-medium text-blue-700 dark:text-white">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        )}
        <br/>
        <div>
          {storyBookPages.length > 0 && (
            <div>
              <div className="flex">
                <div className="flex-none w-50 pt-1">
                  <AudioStreamPlayer prompt={storyBookPages[page - 1].reply} />
                </div>
                <div className="grow px-2">
                  <div
                    className={'text-sm md:text-lg text-secondary mb-4'}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {storyBookPages[page - 1].reply}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="flex-none w-36 md:w-64">
                {storyBookPages[page - 1].image && (
                  <img
                    alt="No Image canneth be foundest"
                    src={`data:image/png;base64,${storyBookPages[page - 1].image}`}
                  />
                )}
                </div>
              </div>
              <div className="flex items-start justify-center mt-1">
                <nav className="Pagination">
                  <ul className="flex pl-0 list-none rounded mt-4">
                    {Array.from({ length: storyBookPages.length }).map((_, index) => (
                      <li key={index}>
                        <button
                          className={`${
                            index + 1 === page
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          } hover:bg-blue-600 hover:text-white px-3 py-2 mx-1 rounded`}
                          onClick={() => handleChange(null, index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(StoryBook, "storybook");
