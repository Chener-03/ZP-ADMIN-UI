<template>
  <div class="tinymce-box">
    <editor v-model="textContent" :init="init" :disabled="disabled" @onClick="onClick"></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'; //tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver/theme'; // 主题文件
import 'tinymce/icons/default';
import 'tinymce/models/dom';
// tinymce插件可按自己的需要进行导入
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'; // 插入上传图片插件
import 'tinymce/plugins/importcss'; //图片工具
import 'tinymce/plugins/media'; // 插入视频插件
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/charmap'; // 特殊字符
import 'tinymce/plugins/wordcount'; // 字数统计插件
import 'tinymce/plugins/codesample'; // 插入代码
import 'tinymce/plugins/code'; // 查看源码
import 'tinymce/plugins/fullscreen'; //全屏
import 'tinymce/plugins/link'; //
import 'tinymce/plugins/preview'; // 预览
import 'tinymce/plugins/template'; //插入模板
import 'tinymce/plugins/save'; // 保存
import 'tinymce/plugins/searchreplace'; //查询替换
import 'tinymce/plugins/pagebreak'; //分页
import 'tinymce/plugins/insertdatetime'; //时间插入
export default {
  name: 'Tiny',
  components: { Editor },
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        'lists image media table wordcount save preview codesample code charmap link insertdatetime template fullscreen',
      //default: 'wordcount visualchars visualblocks toc textpattern template tabfocus spellchecker searchreplace save quickbars print preview paste pagebreak noneditable nonbreaking media insertdatetime importcss imagetools image hr help fullscreen fullpage directionality codesample code charmap link code table lists advlist anchor autolink autoresize autosave'
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo |  formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent blockquote | lists image media table | codesample code removeformat save preview quicklink h2 h3 blockquote numlist bullist table removeformat forecolor backcolor bold italic  strikethrough hr charmap link insertdatetime|subscript superscript cut codesample code |anchor',
      //default: 'formats undo redo paste print fontsizeselect fontselect template fullpage|wordcount ltr rtl visualchars visualblocks toc spellchecker searchreplace|save preview pagebreak nonbreaking|media image|outdent indent aligncenter alignleft alignright alignjustify lineheight  underline quicklink h2 h3 blockquote numlist bullist table removeformat forecolor backcolor bold italic  strikethrough hr charmap link insertdatetime|subscript superscript cut codesample code |anchor preview fullscreen|help'
    },
  },
  data() {
    return {
      init: {
        // width: 720,
        height: 400,
        language_url: '/tinymce/langs/zh-Hans.js',
        language: 'zh-Hans',
        // 皮肤：这里引入的是public下的资源文件
        skin_url: '/tinymce/skins/ui/oxide',
        // skin_url: 'tinymce/skins/ui/oxide-dark',//黑色系
        plugins: this.plugins,
        toolbar: this.toolbar,
        // toolbar: this.toolbar,
        branding: false,
        // 隐藏菜单栏
        menubar: false,
        // 是否显示底部状态栏
        statusbar: true,
        // convert_urls: false,
        init_instance_callback: (editor) => {
          console.log('初始化完成：', editor);
        },
        images_upload_handler: (blobInfo, progress) =>
          new Promise((resolve, reject) => {
            const img = 'data:image/jpeg;base64,' + blobInfo.base64();
            resolve(img);
          }),
      },
      textContent: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.textContent = newValue;
    },
    textContent(newValue) {
      this.$emit('input', newValue);
    },
  },
  created() {},
  mounted() {
    tinymce.init({});
  },
  methods: {
    onClick(e) {
      // 自定义事件给父组件传递数据
      this.$emit('onClick', e, tinymce);
    },
    clear() {
      this.textContent = '';
    },
    setTextContent(text) {
      this.textContent = text;
    },
  },
};
</script>

<style scoped>
.tinymce-box {
  margin: 20px;
}
</style>
