const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

// Принажатии кнопки перехож на окно информации
start_btn.onclick = ()=>{
    info_box.classList.add("activeInfo"); 
}

exit_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); //скрыть информационное окно
}

//если нажата кнопка продолжить викторину
continue_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); //скрыть информационное окно
    quiz_box.classList.add("activeQuiz"); //показать коробку с викториной
    showQuetions(0); 
    queCounter(1); 
    startTimer(15); 
    startTimerLine(0); 
}

let timeValue =  15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// если нажата кнопка перезапуска викторины
restart_quiz.onclick = ()=>{
    quiz_box.classList.add("activeQuiz"); //показать поле для викторины
    result_box.classList.remove("activeResult"); 
    timeValue = 15; 
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count); 
    queCounter(que_numb); 
    clearInterval(counter); 
    clearInterval(counterLine); 
    startTimer(timeValue); 
    startTimerLine(widthValue); 
    timeText.textContent = "Время"; 
    next_btn.classList.remove("show"); // скрыть следующую кнопку
}

// если нажата кнопка выхода из викторины
quit_quiz.onclick = ()=>{
    window.location.reload(); //перезагрузить текущее окно
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// если нажата кнопка
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){ 
        que_count++; 
        que_numb++; 
        showQuetions(que_count); 
        queCounter(que_numb); 
        clearInterval(counter); 
        clearInterval(counterLine); 
        startTimer(timeValue); 
        startTimerLine(widthValue); 
        timeText.textContent = "Время";
        next_btn.classList.remove("show"); 
    }else{
        clearInterval(counter); //очистить счетчик
        clearInterval(counterLine); 
        showResult(); 
    }
}

// получение вопросов и вариантов из массива
function showQuetions(index){
    const que_text = document.querySelector(".que_text");

    let que_tag = '<span>'+ questions[index].numb + ". " + questions[index].question +'</span>';
    let option_tag = '<div class="option"><span>'+ questions[index].options[0] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[1] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[2] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[3] +'</span></div>';
    que_text.innerHTML = que_tag; 
    option_list.innerHTML = option_tag; 
    
    const option = option_list.querySelectorAll(".option");

    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}
// создание новых тегов div для иконок
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//если пользователь нажал на опцию
function optionSelected(answer){
    clearInterval(counter); 
    clearInterval(counterLine); 
    let userAns = answer.textContent; 
    let correcAns = questions[que_count].answer;
    const allOptions = option_list.children.length; 
    
    if(userAns == correcAns){ 
        userScore += 1; 
        answer.classList.add("correct"); 
        answer.insertAdjacentHTML("beforeend", tickIconTag); 
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    }else{
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIconTag); 
        console.log("Wrong Answer");

        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns){
                option_list.children[i].setAttribute("class", "option correct"); 
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); 
                console.log("Auto selected correct answer.");
            }
        }
    }
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled"); 
    }
    next_btn.classList.add("show"); 
}

function showResult(){
    info_box.classList.remove("activeInfo"); // скрыть информационное окно
    quiz_box.classList.remove("activeQuiz"); // скрыть поле с тестом
    result_box.classList.add("activeResult"); //показать окно результата
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 3){ // если пользователь набрал больше 3
       //создание нового тега span и передача количества баллов пользователя и общего количества вопросов
        let scoreTag = '<span>Поздравляю! 🎉 <p>'+ userScore +'</p> из <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else if(userScore > 1){ // если пользователь набрал больше 1
        let scoreTag = '<span>Неплохо 😎<p>'+ userScore +'</p> из <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    else{ // если пользователь набрал меньше 1
        let scoreTag = '<span>Нужно постараться 😐 <p>'+ userScore +'</p> из <p>'+ questions.length +'</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time;
        time--; 
        if(time < 9){ 
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; //добавляем 0 перед значением времени
        }
        if(time < 0){ //если таймер меньше 0
            clearInterval(counter); 
            timeText.textContent = "Конец"; // изменяем текст времени
            const allOptions = option_list.children.length; 
            let correcAns = questions[que_count].answer; 
            for(i=0; i < allOptions; i++){
                if(option_list.children[i].textContent == correcAns){ 
                    option_list.children[i].setAttribute("class", "option correct"); 
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); 
                    console.log("Конец: Auto selected correct answer.");
                }
            }
            for(i=0; i < allOptions; i++){
                option_list.children[i].classList.add("disabled"); 
            }
            next_btn.classList.add("show"); 
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1; //обновление значения времени на 1
        time_line.style.width = time + "px"; 
        if(time > 549){ //если значение времени больше 549
            clearInterval(counterLine); 
        }
    }
}

function queCounter(index){
    //создание нового тега span и передача номера вопроса и всего вопроса
    let totalQueCounTag = '<span><p>'+ index +'</p> из <p>'+ questions.length +'</p> Вопросов</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}