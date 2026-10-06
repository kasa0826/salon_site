// ======================================
// 予約データ
// ======================================

let reservations =
    JSON.parse(
        localStorage.getItem(
            "salonReservations"
        )
    ) || [];


// ======================================
// 営業時間
// ======================================

const timeSlots = [

    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00"

];


let selectedTime = null;


// ======================================
// 今日の日付
// ======================================

function getToday() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;

}


// ======================================
// 予約ページ
// ======================================

const dateInput =
    document.getElementById(
        "date"
    );


if (dateInput) {

    dateInput.value =
        getToday();

    dateInput.min =
        getToday();

    showAvailableTimes();


    dateInput.addEventListener(
        "change",
        showAvailableTimes
    );

}


// ======================================
// 空き時間
// ======================================

function showAvailableTimes() {

    const date =
        document.getElementById(
            "date"
        ).value;


    const timeList =
        document.getElementById(
            "timeList"
        );


    if (!date) {

        timeList.innerHTML =
            "日付を選択してください。";

        return;

    }


    timeList.innerHTML =
        "";


    timeSlots.forEach(
        time => {


            const reserved =
                reservations.some(

                    reservation =>

                        reservation.date ===
                        date &&

                        reservation.time ===
                        time &&

                        reservation.status ===
                        "confirmed"

                );


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "time-button";


            button.type =
                "button";


            if (reserved) {

                button.textContent =
                    `${time}（予約済）`;

                button.classList.add(
                    "reserved"
                );

                button.disabled =
                    true;

            }

            else {

                button.textContent =
                    time;

                button.onclick =
                    () => selectTime(time);

            }


            timeList.appendChild(
                button
            );

        }
    );

}


// ======================================
// 時間選択
// ======================================

function selectTime(time) {

    selectedTime =
        time;


    const date =
        document.getElementById(
            "date"
        ).value;


    document.getElementById(
        "selectedTime"
    ).textContent =

        `${date} ${time}`;


    const form =
        document.getElementById(
            "reservationForm"
        );


    form.style.display =
        "block";


    form.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center"

    });

}


// ======================================
// 予約送信
// ======================================

function submitReservation() {

    const date =
        document.getElementById(
            "date"
        ).value;


    const menu =
        document.getElementById(
            "menuSelect"
        ).value;


    const name =
        document.getElementById(
            "customerName"
        ).value;


    const phone =
        document.getElementById(
            "customerPhone"
        ).value;


    const email =
        document.getElementById(
            "customerEmail"
        ).value;


    if (

        !name ||
        !phone ||
        !email ||
        !selectedTime

    ) {

        alert(
            "必要な情報を入力してください。"
        );

        return;

    }


    const reservation = {

        id:
            Date.now(),

        date:
            date,

        time:
            selectedTime,

        menu:
            menu,

        name:
            name,

        phone:
            phone,

        email:
            email,

        status:
            "pending"

    };


    reservations.push(
        reservation
    );


    saveReservations();


    alert(

        "予約を申請しました！\n\n" +

        "店舗側で確認後、" +

        "予約が確定します。"

    );


    location.reload();

}


// ======================================
// 保存
// ======================================

function saveReservations() {

    localStorage.setItem(

        "salonReservations",

        JSON.stringify(
            reservations
        )

    );

}


// ======================================
// SCROLL ANIMATION
// ======================================

const revealElements =
    document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );


const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "active"
                            );

                    }

                }
            );

        },

        {

            threshold:
                0.15

        }

    );


revealElements.forEach(
    element => {

        observer.observe(
            element
        );

    }
);


// ======================================
// MOBILE MENU
// ======================================

function toggleMenu() {

    const nav =
        document.querySelector(
            ".nav"
        );


    nav.classList.toggle(
        "mobile-open"
    );

}


// ======================================
// 管理画面
// ======================================

const reservationList =
    document.getElementById(
        "reservationList"
    );


if (reservationList) {

    displayReservations();

    updateDashboard();

}


// ======================================
// 予約一覧
// ======================================

function displayReservations() {

    reservationList.innerHTML =
        "";


    if (
        reservations.length === 0
    ) {

        reservationList.innerHTML =
            "<p>現在、予約はありません。</p>";

        return;

    }


    reservations
        .slice()
        .sort(

            (a, b) =>

                (
                    a.date +
                    a.time

                ).localeCompare(

                    b.date +
                    b.time

                )

        )
        .forEach(

            reservation => {


                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "reservation";


                const statusText =

                    reservation.status ===
                    "pending"

                    ?

                    "確認待ち"

                    :

                    "予約確定";


                div.innerHTML = `

                    <h3>
                        ${reservation.date}
                        ${reservation.time}
                    </h3>

                    <p>
                        <strong>
                            メニュー：
                        </strong>

                        ${reservation.menu}

                    </p>

                    <p>
                        <strong>
                            お名前：
                        </strong>

                        ${reservation.name}

                    </p>

                    <p>
                        <strong>
                            電話番号：
                        </strong>

                        ${reservation.phone}

                    </p>

                    <p>
                        <strong>
                            メール：
                        </strong>

                        ${reservation.email}

                    </p>

                    <p>

                        <strong>
                            状態：
                        </strong>

                        <span
                            class="${reservation.status}"
                        >
                            ${statusText}
                        </span>

                    </p>

                    ${
                        reservation.status ===
                        "pending"

                        ?

                        `

                        <button
                            onclick="
                                confirmReservation(
                                    ${reservation.id}
                                )
                            "
                        >
                            この予約を確定する
                        </button>

                        `

                        :

                        `

                        <p>
                            ✓ 予約確定済み
                        </p>

                        `

                    }

                `;


                reservationList
                    .appendChild(
                        div
                    );

            }

        );

}


// ======================================
// 予約確定
// ======================================

function confirmReservation(id) {

    const reservation =
        reservations.find(

            reservation =>
                reservation.id === id

        );


    if (!reservation) {

        return;

    }


    reservation.status =
        "confirmed";


    saveReservations();


    displayReservations();

    updateDashboard();


    alert(
        "予約を確定しました。"
    );

}


// ======================================
// ダッシュボード
// ======================================

function updateDashboard() {

    const today =
        getToday();


    const todayReservations =
        reservations.filter(

            reservation =>
                reservation.date ===
                today

        );


    const pending =
        reservations.filter(

            reservation =>
                reservation.status ===
                "pending"

        );


    const confirmed =
        reservations.filter(

            reservation =>
                reservation.status ===
                "confirmed"

        );


    const todayCount =
        document.getElementById(
            "todayCount"
        );


    const pendingCount =
        document.getElementById(
            "pendingCount"
        );


    const confirmedCount =
        document.getElementById(
            "confirmedCount"
        );


    if (todayCount) {

        todayCount.textContent =
            todayReservations.length;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending.length;

    }


    if (confirmedCount) {

        confirmedCount.textContent =
            confirmed.length;

    }

}


// ======================================
// データ削除
// ======================================

function clearReservations() {

    const result =
        confirm(
            "予約データをすべて削除しますか？"
        );


    if (!result) {

        return;

    }


    localStorage.removeItem(
        "salonReservations"
    );


    reservations = [];


    displayReservations();

    updateDashboard();

}