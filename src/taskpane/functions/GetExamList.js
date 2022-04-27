import * as React from "react";
import { useState, useEffect } from "react";
import { Stack, TextField, PrimaryButton, CommandBarButton, IIconProps } from "@fluentui/react";

const refreshIcon = { iconName: "Refresh" };

const getExamList = (lect_id) => {
  const [exams, setExams] = useState();
  // console.log(lect_id);

  useEffect(() => {
    fetch(`https://mmu-online-exam-addin.herokuapp.com/exams?creator_id=${lect_id}`)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        setExams(data);
      });
  }, []);

  // console.log(exams);
  return (
    <div>
      <CommandBarButton style={{ height: 50 , float: "right" }} onClick={refreshPage} text="Refresh" iconProps={refreshIcon} />
      <div style= {{ margin: "30px" }}>
        {exams && <ExamList exams={exams} />}
      </div>
    </div>
    )
};

function refreshPage() {
  window.location.reload(false);
}

const ExamList = ({ exams }) => {
  return (
    <div align="center">
      <table style={{ border: "1px solid", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid", width: "100px", padding: "15px" }}>Exam ID</th>
            <th style={{ border: "1px solid", width: "200px", padding: "15px" }}>Title</th>
            <th style={{ border: "1px solid", width: "100px", padding: "15px" }}>No. of Questions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr>
              <td style={{ border: "1px solid", padding: "10px" }}>{exam.id}</td>
              <td style={{ border: "1px solid", padding: "10px" }}>{exam.title}</td>
              <td style={{ border: "1px solid", padding: "10px" }}>{exam.number_of_questions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { getExamList };
