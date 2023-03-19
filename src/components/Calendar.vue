<template>
    <table class="table table-border">
        <tr>
            <td colspan="1" class="text-align-center">
                <a @click="previousMonth">{{ '<<' }}</a>
            </td>
            <td colspan="5" class="text-align-center">
                {{ currentMonthAndYear }}
            </td>
            <td colspan="1" class="text-align-center">
                <a @click="nextMonth">{{ '>>' }}</a>
            </td>
        </tr>
        <tr>
            <td class="text-align-center">M</td>
            <td class="text-align-center">T</td>
            <td class="text-align-center">W</td>
            <td class="text-align-center">T</td>
            <td class="text-align-center">F</td>
            <td class="text-align-center">S</td>
            <td class="text-align-center">S</td>
        </tr>
        <tr v-for="item in gridArray">
            <td v-for="data in item" class="text-align-center">
                <div @click="$emit('click-date', data.date)" class="calendar-date"
                    :is-month-day="data.isDayOfMonth ? undefined : ''" :is-today="data.isToday ? '' : undefined">
                    {{ data.date.getDate() }}
                </div>
            </td>
        </tr>
    </table>
</template>

<script lang="ts">
import { dateFromMs, nowInMs } from '@/middleware/helpers';

export default {
    emits: ['click-date'],
    data() {
        return {
            filterDate: undefined as undefined | Date,
            selectedMonth: new Date(),
            currentMonthAndYear: dateFromMs(nowInMs())
                .toLocaleDateString(undefined, { year: 'numeric', month: 'short' }),
        };
    },
    methods: {
        previousMonth: function () {
            var tmpDate = this.selectedMonth;
            var tmpMonth = tmpDate.getMonth() - 1;
            this.selectedMonth = new Date(tmpDate.setMonth(tmpMonth));
            this.currentMonthAndYear = this.selectedMonth
                .toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
        },
        nextMonth: function () {
            var tmpDate = this.selectedMonth;
            var tmpMonth = tmpDate.getMonth() + 1;
            this.selectedMonth = new Date(tmpDate.setMonth(tmpMonth));
            this.currentMonthAndYear = this.selectedMonth
                .toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
        },
        setDate: function (date: Date) {
            if (date == this.filterDate) {
                console.log('setting undefined');
                this.filterDate = undefined;
                //unselected
            } else {
                this.filterDate = date;
            }
        },
        getCalendarMatrix: function (date: Date) {
            var calendarMatrix = []

            var startDay = new Date(date.getFullYear(), date.getMonth(), 1)
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

            // Modify the result of getDay so that we treat Monday = 0 instead of Sunday = 0
            var startDow = (startDay.getDay() + 6) % 7;
            var endDow = (lastDay.getDay() + 6) % 7;

            // If the month didn't start on a Monday, start from the last Monday of the previous month
            startDay.setDate(startDay.getDate() - startDow);

            // If the month didn't end on a Sunday, end on the following Sunday in the next month
            lastDay.setDate(lastDay.getDate() + (6 - endDow));

            var week = []
            var today = dateFromMs(nowInMs());
            while (startDay <= lastDay) {
                var isCurrentMonth = startDay.getMonth() === date.getMonth();
                var isToday = startDay.getFullYear() === today.getFullYear() &&
                    startDay.getMonth() === today.getMonth() && startDay.getDate() === today.getDate();
                week.push({ date: new Date(startDay), isDayOfMonth: isCurrentMonth, isToday: isToday });
                if (week.length === 7) {
                    calendarMatrix.push(week);
                    week = [];
                }
                startDay.setDate(startDay.getDate() + 1)
            }

            return calendarMatrix;
        }

    },
    computed: {
        gridArray: function () {
            var grid = this.getCalendarMatrix(this.selectedMonth);
            return grid;
        },
        formattedDate: function () {
            return this.filterDate ? this.filterDate
                .toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
        }
    }

}
</script>

<style scoped>
[is-today] {
    border: 1px solid var(--color-accent);
}

[is-month-day] {
    opacity: 0.5;
}

.calendar-date:hover,
a:hover {
    background-color: var(--color-primary);
    cursor: pointer;
}

.text-align-end {
    text-align: end;
}

.text-align-center {
    text-align: center;
}
</style>