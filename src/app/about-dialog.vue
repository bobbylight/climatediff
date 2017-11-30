<template>
    <div class='about-dialog-content'>
        <div class="modal fade" tabindex="-1" role="dialog" id="aboutModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h3 class="modal-title"><i class="fa fa-cloud"></i> About ClimateDiff</h3>
                    </div>
                    <div class="modal-body">
                        <div class="modal-top-content">
                            <span>
                                <img class="about-image" src="img/about-dialog-image.png">
                            </span>
                            <span>
                            We were thinking about moving.  Moving to somewhere very cold.  I thought it
                            would be fun to visualize just how much different the weather was in this
                            new city from what it is where I currently live.  Thus, this site was born.
                            </span>
                        </div>

                        <h4>Thanks</h4>
                        <ul>
                            <li>This site uses the NOAA's <a href='http://www.ncdc.noaa.gov/cdo-web/webservices/v2'>
                                Web services</a> to generate its pretty charts.</li>
                            <li>The source code for this application <a href='https://github.com/bobbylight/climatediff'>
                                lives on GitHub</a>.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: {
        show: {
            type: Boolean,
            required: false
        }
    },

    data: function() {
        return {
            instantiated: false
        };
    },

    watch: {
        show(newValue) {

            console.log('New value: ' + newValue);
            const $modal = $('#aboutModal');

            if (newValue) {
                $modal.modal('show');
                if (!this.instantiated) {
                    $modal.on('hidden.bs.modal', (e) => {
                        this.$emit('hidden');
                    });
                    this.instantiated = true;
                }
            }
            else {
                $modal.modal('hide');
            }
        }
    }
}
</script>

<style lang="less">
.about-dialog-content {

    .modal-content {

        width: 640px;

        .modal-body {

            padding: 30px;

            .modal-top-content {
                display: table;

                span {
                    display: table-cell;
                    vertical-align: middle;

                    .about-image {
                        width: 133px; // 50% of actual size
                        height: 134px; // 50% of actual size
                        padding-right: 30px;
                    }
                }
            }

            h4 {
                margin-top: 3rem;
            }
        }
    }
}
</style>