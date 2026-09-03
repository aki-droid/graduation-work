class ContactMailer < ApplicationMailer
  default from: "onboarding@resend.dev"

  def received_email(contact)
    @contact = contact

    mail(
      to: "aki_m_415@yahoo.co.jp",
      subject: "【きぶんご飯】お問い合わせが届きました"
    )
  end
end
