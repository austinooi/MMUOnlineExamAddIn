import * as React from "react";

const submitQuestions = () => {
    console.log("submit");
      return(
          <div>
              {/* <MessageBar
                  // actions={
                  // <div>
                  //     <MessageBarButton>Yes</MessageBarButton>
                  //     <MessageBarButton>No</MessageBarButton>
                  // </div>
                  // }
                  messageBarType={MessageBarType.success}
                  isMultiline={false}
              >
                  Success MessageBar with single line and action buttons.
                  {/* <Link href="www.bing.com" target="_blank" underline> */}
                  {/* Visit our website. */}
                  {/* </Link> */}
              {/* </MessageBar> */}
              questions submitted
          </div>
      )
      
}

export {submitQuestions}