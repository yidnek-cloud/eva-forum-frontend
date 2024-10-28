import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "../../API/axiosConfig";
import { AuthContext } from "../../App";
import QueAnsBox from "../../Components/QueAnsBox/QueAnsBox";
import classes from "./answer.module.css";
import LayOut from "../../Components/Layout/LayOut";

function Answer() {
  const [answer, setAnswer] = useState("");
  const [ans, setAns] = useState(null);
  const [answerError, setAnswerError] = useState("");
  const [newAnswer, setNewAnswer] = useState(false);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const storedQuestion = JSON.parse(localStorage.getItem("selectedQuestion"));
  const question = storedQuestion || null;

  console.log(question);

  useEffect(() => {
    const getAnswer = async () => {
      try {
        const token = localStorage.getItem("token"); // Safely access localStorage

        const { data: answerData } = await axios.get(`/answer/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(answerData.answers);

        setAns(answerData.answers);
      } catch (error) {
        console.error("Error getting answer:", error);
      }
    };
    getAnswer();
  }, [newAnswer, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;
    setAnswerError("");
    if (!answer) {
      setAnswerError("Answer is required.");
      isValid = false;
    } else if (answer.length < 5) {
      setAnswerError("answer must be at least 5 characters long!");
      isValid = false;
    }
    if (!isValid) return;
    const answerData = {
      userid: user.userid,
      questionid: id,
      answer: answer,
    };

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("/answer/postAnswers", answerData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("posted successfully");
      setAnswer("");
      setNewAnswer(!newAnswer);
      //   console.log(data);
    } catch (error) {
      alert(error?.response?.data?.msg);
      //   console.log(error.response.data);
    }
  };

  return (
    <LayOut>
      <section className={classes.outerContainer}>
        <div>
          <div>
            <h2>Question</h2>

            <div>
              <div className={classes.icon_container}>
                <i className={`fas fa-arrow-circle-right ${classes.icon}`}></i>

                <span className={classes.titleSpan}>{question.title}</span>
              </div>

              <div className={classes.line}></div>
            </div>
            <p>{question.content}</p>
            <h2 className={classes.answerBorder}>Answer From The Community </h2>
            {ans ? (
              <div>
                {ans?.map((ans, i) => (
                  <QueAnsBox
                    content={true}
                    key={i}
                    transition={false}
                    data={ans}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", margin: "50px 0" }}>
                Be the first to answer the question!
              </div>
            )}
          </div>
        </div>
        <h2 className={classes.topAnswer}>Answer The Top Question</h2>
        <div className={classes.goToQuestion}>
          <Link to="/home">Go to question page</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <textarea
              id="content"
              name="content"
              value={answer}
              className={classes.textarea}
              rows="15"
              cols="109"
              placeholder="your answer"
              onChange={(e) => setAnswer(e.target.value)}
            ></textarea>
            <br />
            {answerError && (
              <span className={classes.error}>{answerError}</span>
            )}
            <br />
            <button type="submit">Post Answer</button>
          </div>
        </form>
      </section>
    </LayOut>
  );
}

export default Answer;
