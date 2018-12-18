# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :vapid_public_key

  def vapid_public_key
    @vapid_public_key ||= Base64.urlsafe_decode64(ENV['VAPID_PUBLIC_KEY']).bytes
  end

  def admin_login_check
    redirect_to('') if session[:administrator_key] != 'mzyy2_wypX-Qaf42VVxR'
  end
end
