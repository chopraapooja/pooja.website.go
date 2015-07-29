require 'active_support/core_ext/numeric/time'

activate :automatic_image_sizes
activate :directory_indexes
activate :asset_host

configure :development do
  activate :livereload
end

set :fonts_dir, 'assets_site/fonts'
set :css_dir, 'assets_site/stylesheets'
set :js_dir, 'assets_site/javascripts'
set :images_dir, 'assets_site/images'

config[:file_watcher_ignore] += [ /.idea\// ]

if ENV['S3_BUCKET']
  # to disable the warning about periods in s3 bucket name.
  Fog.credentials = { :path_style => true }

  activate :s3_redirect do |config|
    config.bucket                = ENV['S3_BUCKET']
    config.region                = 'us-east-1'
    config.aws_access_key_id     = ENV['S3_ACCESS_KEY']
    config.aws_secret_access_key = ENV['S3_SECRET_KEY']
    # don't s3 redirect immediately after build
    config.after_build           = false
  end

  activate :s3_sync do |config|
    config.bucket                = ENV['S3_BUCKET']
    config.region                = 'us-east-1'
    config.aws_access_key_id     = ENV['S3_ACCESS_KEY']
    config.aws_secret_access_key = ENV['S3_SECRET_KEY']
    config.delete                = false
    # don't s3 sync immediately after build
    config.after_build           = false
  end

  if ENV['CLOUDFRONT_DISTRIBUTION']
    activate :cloudfront do |cf|
      cf.access_key_id = ENV['S3_ACCESS_KEY']
      cf.secret_access_key = ENV['S3_SECRET_KEY']
      cf.distribution_id = ENV['CLOUDFRONT_DISTRIBUTION']
      cf.after_build = false  # default is false
    end
  end

  caching_policy 'text/html', max_age: 0, must_revalidate: true
  default_caching_policy max_age: 365.days, public: true
end

configure :build do
  activate :minify_css
  activate :minify_javascript

  activate :asset_hash do |opts|
    opts.exts += %w(.ico)
  end

  abort "ENV['ASSET_HOST'] not specified, bailing!" if ENV['ASSET_HOST'].blank?
  set :asset_host, "//" + ENV['ASSET_HOST']
end
