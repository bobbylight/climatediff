// This magic allows importing vue components in *.ts files
declare module "*.vue" {
    import Vue from 'vue';
    export default Vue;
}
