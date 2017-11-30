export default class MonthUtil {

    private static MONTHS: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    static get(i: number): string {
        return MonthUtil.MONTHS[i];
    }
}
