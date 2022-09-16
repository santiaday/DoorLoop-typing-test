import React, { ChangeEvent, Component, useEffect } from "react";
import "./styles.scss";

//Declaring state with all that im going to need

interface State {
  typeTest: Array<string>;
  words: Array<string>;
  enteredText: string;
  correctCount: number;
  incorrectCount: number;
  started: boolean;
  startTime: Date | null;
  wordsPerMinute: number | null;
  finished: false;
  seconds: number;
  currentWordIndex: number;
  buttonClicked: number;
}

class App extends Component {
  //Initializing state with initial values including the wordbank already given
  state: State = {
    typeTest: [],
    words: [
      "account",
      "act",
      "addition",
      "adjustment",
      "advertisement",
      "agreement",
      "air",
      "amount",
      "amusement",
      "animal",
      "answer",
      "apparatus",
      "approval",
      "argument",
      "art",
      "attack",
      "attempt",
      "attention",
      "attraction",
      "authority",
      "back",
      "balance",
      "base",
      "behavior",
      "belief",
      "birth",
      "bit",
      "bite",
      "blood",
      "blow",
      "body",
      "brass",
      "bread",
      "breath",
      "brother",
      "building",
      "burn",
      "burst",
      "business",
      "butter",
      "canvas",
      "care",
      "cause",
      "chalk",
      "chance",
      "change",
      "cloth",
      "coal",
      "color",
      "comfort",
      "committee",
      "company",
      "comparison",
      "competition",
      "condition",
      "connection",
      "control",
      "cook",
      "copper",
      "copy",
      "cork",
      "cotton",
      "cough",
      "country",
      "cover",
      "crack",
      "credit",
      "crime",
      "crush",
      "cry",
      "current",
      "curve",
      "damage",
      "danger",
      "daughter",
      "day",
      "death",
      "debt",
      "decision",
      "degree",
      "design",
      "desire",
      "destruction",
      "detail",
      "development",
      "digestion",
      "direction",
      "discovery",
      "discussion",
      "disease",
      "disgust",
      "distance",
      "distribution",
      "division",
      "doubt",
      "drink",
      "driving",
      "dust",
      "earth",
      "edge",
      "education",
      "effect",
      "end",
      "error",
      "event",
      "example",
      "exchange",
      "existence",
      "expansion",
      "experience",
      "expert",
      "fact",
      "fall",
      "family",
      "father",
      "fear",
      "feeling",
      "fiction",
      "field",
      "fight",
      "fire",
      "flame",
      "flight",
      "flower",
      "fold",
      "food",
      "force",
      "form",
      "friend",
      "front",
      "fruit",
    ],
    enteredText: "",
    correctCount: 0,
    incorrectCount: 0,
    started: false,
    startTime: null,
    wordsPerMinute: null,
    finished: false,
    seconds: 60,
    currentWordIndex: 0,
    buttonClicked: 0,
  };

  //Quick method to calculate the wpm using 60 seconds as the default time
  wordsPerMinute = (charsTyped: number): number =>
    Math.floor(charsTyped / 5 / 1);

  //Method to perform all of the necessary logic once the game is finished, including calculations
  checkFinished = (): void => {
    const charsTyped: number = this.state.typeTest.join("").length;

    const wpm = this.wordsPerMinute(charsTyped);
    this.setState({ wordsPerMinute: wpm, finished: true });
  };

  //Method to render a new set of words. This is called at the beginning of the game as well as when all of the words on the screen at one time have been typed.
  renderNewWords() {
    //To display the words, im going to render them as HTML elements directly from the class
    const wordBank = document.getElementById("words") as HTMLElement;

    //To make the game more difficult, I created simple logic to randomize the words to make sure they are not in alphabetical order
    let currentIndex = this.state.words.length,
      randomIndex;

    // While there remain elements to shuffle.
    let newWordBank = this.state.words;
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [newWordBank[currentIndex], newWordBank[randomIndex]] = [
        newWordBank[randomIndex],
        newWordBank[currentIndex],
      ];
    }

    //Took only a portion of the generated words to display at one time, since all of the words at one time wont fit
    let tempWords = newWordBank.slice(
      this.state.currentWordIndex,
      this.state.currentWordIndex + 14
    );

    //Mapping over the array of words and returning them as HTML elements to be rendered
    let array = tempWords.map((value , i) => {

      //wrap the characters in a span tag
      if(i == 0){
        return "<span class='wordsChars current-word'>" + value + "</span>";
      }

      return "<span class='wordsChars'>" + value + " </span>";
    });



    //join array for displaying
    wordBank.innerHTML += array.join("");
  }

  //Most important method. This runs every time the input is changed. checks things like if spacebar, if first character, if the word is correct/wrong, etc.
  onWordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    //Starts the timer when the user types the first character
    if (!this.state.started) {
      this.setState({ started: true });
      this.runTimer();
    }

    //Stores the entered text in the state to keep track of whether or not it is correct
    const enteredText = e.currentTarget.value;
    this.setState({ enteredText });

    //Getting all of the rendered words to compare with user input
    let wordChars = document.querySelectorAll<HTMLElement>(".wordsChars");

    //Initializing variables to the state to later mutate the state (states shouldnt be mutated directly)
    let mistakes = this.state.incorrectCount;
    let correct = this.state.correctCount;
    let typedWords = this.state.typeTest;

    //Checks if the user inputted a space to submit the word and check it
    if (e.currentTarget.value.includes(" ")) {
      //Checks the target word
      let currentWord = this.state.currentWordIndex;
      wordChars[this.state.currentWordIndex].classList.remove('current-word');


      //Checks the accuracy of the word, adds to the correct or incorrect, and adds to the typedWords which keeps track of the total words.
      if (
        e.currentTarget.value.trim() === wordChars[currentWord].innerText.trim()
      ) {
        wordChars[currentWord].classList.add("success");
        typedWords.push(wordChars[currentWord].innerText.trim());
        correct++;
      } else {
        wordChars[currentWord].classList.add("fail");
        typedWords.push(wordChars[currentWord].innerText.trim());
        mistakes++;
      }

      //Moves the currentWord up one index to move onto the next word and sets the states to prepare for the next word.
      currentWord += 1;
      this.setState({
        currentWordIndex: currentWord,
        enteredText: "",
        typeTest: typedWords,
        incorrectCount: mistakes,
        correctCount: correct,
      });

      if(currentWord < 14){
        wordChars[currentWord].classList.add('current-word');
      }


      //Checks number of words to check if more words need to be rendered or not
      if (currentWord % 14 == 0 && currentWord > 0) {
        //If words need to be re-rendered, the old words are first deleted by directly deleting the HTML elements
        let oldWords = document.querySelectorAll<HTMLElement>(".wordsChars");

        oldWords.forEach((e) => {
          e.remove();
        });

        //Current word index set back to the first word and state is updated
        currentWord = 0;
        this.setState({ currentWordIndex: 0 });

        //New words are rendered
        this.renderNewWords();
      }
    }
  };

  //This method starts the timer and controls some of the element classes to fade in and fade out
  runTimer() {
    //Grab the elements with jquery
    let input = document.querySelector("#textInput") as HTMLElement;
    let timeLeftText = document.querySelector("#timeLeftText") as HTMLElement;

    //Saves the seconds state to a local variable to be used to update state
    let counter = this.state.seconds;

    //Simple logic to run the clock down and also update the state as it is going down so that it will display on the screen
    const interval = setInterval(() => {
      counter--;
      this.setState({ seconds: counter });

      //Logic for when the timer runs out
      if (counter == 0) {
        clearInterval(interval);

        //Sets the state finished to true and buttonClicked which is for scss classes
        this.setState({ finished: true, buttonClicked: -1 });

        //Call the method for when the game is finished
        this.checkFinished();

        //Removes the timer text and the input area
        timeLeftText.classList.remove("active");
        input.classList.remove("active");
      }
    }, 1000);
  }

  handleToggleTextArea() {
    //Grab the elements with jquery
    let input = document.querySelector("#textInput") as HTMLElement;
    let button = document.querySelector("#startButton") as HTMLButtonElement;
    let timeLeftText = document.querySelector("#timeLeftText") as HTMLElement;

    //Set buttonClicked state to 1 for scss classes
    this.setState({ buttonClicked: 1 });

    if (!this.state.started) {
      //Change element classes to achieve the fade in/fade out look
      input.classList.add("active");
      button.classList.add("inactive");
      button.disabled = true;
      timeLeftText.classList.add("active");

      //Render the first batch of words
      this.renderNewWords();
    }
  }

  render() {
    return (
      <div className="container">
        <div className="content">
          <h1 className="h1Styles">DoorLoop Typing Test</h1>
          {this.state.buttonClicked === 0 ? (
            <h2 className="h2Styles">
              Press 'Start' to begin the typing test.
            </h2>
          ) : this.state.buttonClicked === 1 ? (
            <h2 className="h2Styles">Start typing to begin the test.</h2>
          ) : (
            <></>
          )}
          <button
            className="startText customButton"
            id="startButton"
            onClick={() => this.handleToggleTextArea()}
          >
            <span className="circle">
              <span className="icon arrow"></span>
            </span>
            <span className="buttonText">Start</span>
          </button>
          {!this.state.finished ? (
            <div id='contentWrapper'>
              <h2 id="timeLeftText">
                Time Left: {this.state.seconds} seconds
              </h2>
              <div className="textWordBankWrapper">
                <div className="textInputContainer">
                  <input
                    id="textInput"
                    value={this.state.enteredText}
                    onChange={this.onWordChange}
                    autoComplete="off"
                  />
                </div>
                <div id="words"></div>
              </div>
            </div>
          ) : (
            <div id="resultsContainer active">
              <h1>Results: </h1>
              <br />
              <h2 className="resultsHeadings">
                WPM: {this.state.wordsPerMinute}
              </h2>
              <h2 className="resultsHeadings">
                Correct Words: {this.state.correctCount}
              </h2>
              <h2 className="resultsHeadings">
                Incorrect Words: {this.state.incorrectCount}
              </h2>
              <h2 className="resultsHeadings">
                Accuracy Percentage:{" "}
                {this.state.typeTest.length > 0
                  ? Math.floor(
                      ((this.state.correctCount - this.state.incorrectCount) /
                        this.state.typeTest.length) *
                        100
                    )
                  : 0}
                %
              </h2>
              <br />
              <br />
              <button
                className="startText customButton"
                id="startButton"
                onClick={() => window.location.reload()}
              >
                <span className="circle">
                  <span className="icon arrow"></span>
                </span>
                <span className="buttonText">Restart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
