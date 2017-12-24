export default class MonthUtil {

    private static readonly MONTHS: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
        'Nov', 'Dec'];

    static get(i: number): string {
        return MonthUtil.MONTHS[i];
    }
}
