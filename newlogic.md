### Scrapper algoritması - logici

### her bir selectorlara ilgili alanlar girilecek veya tıklanılacak en sonunda form bilgisi teklif olarak dönecek ve front endimize basılacak

### önce bu form doldurulsun ve giriş yapılsın

<form data-gtm-form-interact-id="0"><div class="mb-3"><div class="p-iconfield" data-pc-name="iconfield" pc49="" data-pc-section="root"><span class="p-inputicon bi bi-person fs-6" data-pc-name="inputicon" pc50="" data-pc-section="root"></span><input type="text" class="p-inputtext p-component p-filled p-inputtext-fluid" placeholder="Kullanıcı Adı" autocomplete="username" maxlength="10" data-pc-name="inputtext" pc51="" data-pc-section="root" value="BULUT1" data-gtm-form-interact-field-id="0"></div></div><div class="mb-3"><div class="p-iconfield" data-pc-name="iconfield" pc52="" data-pc-section="root"><span class="p-inputicon bi bi-lock fs-6" data-pc-name="inputicon" pc53="" data-pc-section="root" style="z-index: 1;"></span><div class="p-password p-component p-inputwrapper p-inputwrapper-filled p-password-fluid" autocomplete="current-password" data-pc-name="password" pc54="" data-pc-section="root"><input type="password" class="p-inputtext p-component p-filled p-inputtext-fluid p-password-input" aria-controls="pv_id_8_overlay" aria-expanded="false" aria-haspopup="true" placeholder="Parola" data-pc-name="pcinputtext" data-pc-extend="inputtext" pc55="" data-pc-section="root" value="EEsigorta.2828" style="padding-left: calc((var(--p-form-field-padding-x)* 2) + var(--p-icon-size)); padding-right: var(--p-form-field-padding-x);" data-gtm-form-interact-field-id="1"><!----><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-password-toggle-mask-icon p-password-unmask-icon" aria-hidden="true" data-pc-section="unmaskicon"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0535499 7.25213C0.208567 7.59162 2.40413 12.4 7 12.4C11.5959 12.4 13.7914 7.59162 13.9465 7.25213C13.9487 7.2471 13.9506 7.24304 13.952 7.24001C13.9837 7.16396 14 7.08239 14 7.00001C14 6.91762 13.9837 6.83605 13.952 6.76001C13.9506 6.75697 13.9487 6.75292 13.9465 6.74788C13.7914 6.4084 11.5959 1.60001 7 1.60001C2.40413 1.60001 0.208567 6.40839 0.0535499 6.74788C0.0512519 6.75292 0.0494023 6.75697 0.048 6.76001C0.0163137 6.83605 0 6.91762 0 7.00001C0 7.08239 0.0163137 7.16396 0.048 7.24001C0.0494023 7.24304 0.0512519 7.2471 0.0535499 7.25213ZM7 11.2C3.664 11.2 1.736 7.92001 1.264 7.00001C1.736 6.08001 3.664 2.80001 7 2.80001C10.336 2.80001 12.264 6.08001 12.736 7.00001C12.264 7.92001 10.336 11.2 7 11.2ZM5.55551 9.16182C5.98308 9.44751 6.48576 9.6 7 9.6C7.68891 9.59789 8.349 9.32328 8.83614 8.83614C9.32328 8.349 9.59789 7.68891 9.59999 7C9.59999 6.48576 9.44751 5.98308 9.16182 5.55551C8.87612 5.12794 8.47006 4.7947 7.99497 4.59791C7.51988 4.40112 6.99711 4.34963 6.49276 4.44995C5.98841 4.55027 5.52513 4.7979 5.16152 5.16152C4.7979 5.52513 4.55027 5.98841 4.44995 6.49276C4.34963 6.99711 4.40112 7.51988 4.59791 7.99497C4.7947 8.47006 5.12794 8.87612 5.55551 9.16182ZM6.2222 5.83594C6.45243 5.6821 6.7231 5.6 7 5.6C7.37065 5.6021 7.72553 5.75027 7.98762 6.01237C8.24972 6.27446 8.39789 6.62934 8.4 7C8.4 7.27689 8.31789 7.54756 8.16405 7.77779C8.01022 8.00802 7.79157 8.18746 7.53575 8.29343C7.27994 8.39939 6.99844 8.42711 6.72687 8.37309C6.4553 8.31908 6.20584 8.18574 6.01005 7.98994C5.81425 7.79415 5.68091 7.54469 5.6269 7.27312C5.57288 7.00155 5.6006 6.72006 5.70656 6.46424C5.81253 6.20842 5.99197 5.98977 6.2222 5.83594Z" fill="currentColor"></path></svg><span class="p-hidden-accessible" aria-live="polite" data-pc-section="hiddenaccesible" data-p-hidden-accessible="true">Şifre Giriniz</span></div></div></div><!----><button class="p-button p-component p-button-fluid mb-3" type="submit" aria-label="GİRİŞ YAP" data-pc-name="button" data-p-disabled="false" pc57="" data-pc-section="root"><!----><span class="p-button-label" data-pc-section="label">GİRİŞ YAP</span><!----></button><a href="/dashboard/forgot-password" class="d-block text-center">Parolamı unuttum</a></form>

### Sonra google otp validasyon sayfası çıkacak secretten 6 haneli kod üretip gir

<div class="p-inputotp p-component" data-pc-name="inputotp" pc62="" data-pc-section="root"><input type="text" class="p-inputtext p-component p-inputtext-lg p-inputfield-lg p-variant-filled p-inputotp-input" inputmode="text" data-pc-name="pcinputtext" data-pc-extend="inputtext" pc63="" data-pc-section="root"><input type="text" class="p-inputtext p-component p-inputtext-lg p-inputfield-lg p-variant-filled p-inputotp-input" inputmode="text" data-pc-name="pcinputtext" data-pc-extend="inputtext" pc64="" data-pc-section="root"><input type="text" class="p-inputtext p-component p-inputtext-lg p-inputfield-lg p-variant-filled p-inputotp-input" inputmode="text" data-pc-name="pcinputtext" data-pc-extend="inputtext" pc65="" data-pc-section="root"><input type="text" class="p-inputtext p-component p-inputtext-lg p-inputfield-lg p-variant-filled p-inputotp-input" inputmode="text" data-pc-name="pcinputtext" data-pc-extend="inputtext" pc66="" data-pc-section="root"><input type="text" class="p-inputtext p-component p-inputtext-lg p-inputfield-lg p-variant-filled p-inputotp-input" inputmode="text" data-pc-name="pcinputtext" data-pc-extend="inputtext" pc67="" data-pc-section="root"><input type="text" class="p-inputtext p-component p-inputtext-lg p-inputfield-lg p-variant-filled p-inputotp-input" inputmode="text" data-pc-name="pcinputtext" data-pc-extend="inputtext" pc68="" data-pc-section="root"></div>

### Dashboarda yönlendirecek ama url / bot olacak bunu aşmak için dinamik selector arayışına gir Ana Sayfayı Yükle - ANA SAYFAYI YÜKLE butonu ve tıkla sonra dashboarda giricek

### çıkarsa kapat

<div class="info-box"><div class="info-box__count">3</div><div class="info-box__icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" class=""><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m8 8l32 32M8 40L40 8"></path></svg></div>KAPAT</div>

### z index > 50 olanları kapat HAYIR | X gibi selector ara

### bu butona bas

<button data-v-84f46f20="" class="p-button p-component p-button-fluid" type="button" data-pc-name="button" data-p-disabled="false" pc337="" data-pc-section="root"><span data-v-84f46f20="" class="d-flex justify-content-center align-items-center text-primary rounded-pill bg-white bi bi-magic" style="width: 2rem; height: 2rem;"></span>YENİ İŞ TEKLİFİ<span data-v-84f46f20="" class="bi bi-arrow-right-short fs-5 pe-2 ms-auto"></span></button>

### iş teklifi butonundan sonra modal açılacak burada içerisinen teklif al butonuna bas

<div class="p-card-body" data-pc-section="body"><!----><div class="p-card-content" data-pc-section="content"><div class="job__content"><div class="job__name">Trafik</div><img class="job__image" src="https://cdn2.somposigorta.com.tr/shared-ejento/ProductImages/trafik.svg"><div class="d-flex align-items-center justify-content-between gap-2 w-100"><button class="job__favorite" type="button" data-pd-tooltip="true"><span class="pi pi-star"></span></button><button class="p-button p-component p-button-outlined p-button-sm" type="button" aria-label="TEKLİF AL" data-pc-name="button" data-p-disabled="false" pc177="" data-pc-section="root"><!----><span class="p-button-label" data-pc-section="label">TEKLİF AL</span><!----></button></div></div></div><!----></div>

### Sonra yeni bir sayfa açılacak dikkat !

### trafik checkboxu seçilecek

<input id="chkTraffic" type="checkbox">

### checkboxa tıkla

<input id="chkCasco" type="checkbox" checked="checked"> ## checked olmamlı tıklandıktan sonra kontrol et

### checkbox tıkla checked olmalı bu trafik

<input id="chkTraffic" type="checkbox" checked="checked">

### Formdan gelenleri ilgile yerlere doldur

<div class="inputLeftContent" id="divCascoPlateAndEgmControls">

<div class="inputRow">
<div class="leftCell">
<span id="lblPlateNo">Araç Plakası:</span>
</div>
<div class="rightCell">
<input id="txtPlateNoCityNo" type="text" maxlength="3" tabindex="2" style="width: 25px; float: left">
<input id="txtPlateNo" type="text" tabindex="3" style="width: 105px; float: left; margin-left: 2px">
<img id="btnPlateHelp" alt="Plaka Yardım" src="/images/help-icon.png" style="border: none; cursor: pointer; float: left; margin-left: 2px; margin-top: 2px">
</div>
</div>
<div class="inputRow" id="divEGMNoCode">
<div class="leftCell">
<span id="lblEGMSeri">Tescil Seri Kod:</span>
</div>
<div class="rightCell">
<input id="txtEGMNoCode" type="text" maxlength="3" tabindex="5" style="width: 27px">
</div>
</div>
<div class="inputRow">
<div class="leftCell">
<span id="lblEGMNo">Tescil/ASBIS No:</span>
<div class="search-icon"></div>
</div>
<div class="rightCell">
<input id="txtEGMNoNumber" type="text" maxlength="19" tabindex="6" style="width: 140px; float: left">
<img id="btnSearchEgm" alt="EGM Sorgula" src="https://cdn.somposigorta.com.tr/cosmos/images/btn_SearchProvince.gif" style="border: none; margin-left: 2px" tabindex="7">

                    <img id="btnDetailsEgm" alt="Egm Detay" src="https://cdn.somposigorta.com.tr/cosmos/images/egmdetail.png" style="width: 20px; display: none; cursor: pointer">

                </div>
            </div>
            <div class="inputRow" id="divAuthCode" style="display: none">
                <div class="leftCell">
                    <span>SBM Otorizasyon Kodu:</span>
                </div>
                <div class="rightCell">
                    <input id="txtAuthCode" type="text" tabindex="13" style="width: 140px">
                </div>
            </div>
            <div class="inputRow">
                <span id="lblInputTabLeftWarning" class="warning" style="display: none">Trafik teklifi almak istiyorsanız Tescil Seri Kod/No giriniz.</span>
            </div>
        </div>

### tc kimlik girilecek

<input id="txtIdentityOrTaxNo" type="text" maxlength="11" tabindex="1" style="width: 96px">

### buna tıklanılacak ve adres bilgisi otomatik doldurulacak

<textarea id="txtCustAddress" style="width: 190px; height: auto; min-height: 40px; overflow: visible" readonly="readonly" rows="4" cols="4"></textarea>

### son adımda teklif al butonuna tıklanılacak

<a id="btnProposalCreate" tabindex="13" style="cursor: pointer;">Teklif Oluştur</a>

### bilgileri buradan çek

<div class="proposalContainer">

        <div class="proposalLeftContent">
            <div class="proposalHeader" style="height: 25px;">
                <span style="margin-top: 3px;">Kasko Teklifi</span>
            </div>
            <div id="loadingDivCascoProposal2" class="loadingDiv">
            </div>
            <div id="loadedDivCascoProposal2Error" class="loadedDivCascoProposal1Error">
                <span id="lblCascoProposal2Error"></span>
            </div>
            <div id="loadedDivCascoProposal2" style="display: none; height: auto;">
                <div class="inputRow" style="margin-left: 16px">
                    <div style="width: 320px; height: 20px;">
                        <div class="proposalLeftCell" style="width: 130px;">
                            <span>&nbsp;Teklif No&nbsp; :&nbsp;&nbsp;</span>
                        </div>
                        <div class="proposalRightCell" style="width: auto; float: left;">
                            <span id="lblCascoProposal2TransactionNo"></span>
                            <img src="https://cdn.somposigorta.com.tr/cosmos/images/exclamation16.png" id="btnDeductibleClauses" style="padding-left: 4px; display: none; cursor: pointer">
                        </div>
                    </div>
                </div>
                <div class="inputRow" style="margin-left: 16px">
                    <div style="width: 340px; height: 20px;">
                        <div class="proposalLeftCell" style="width: 130px;">
                            <span>&nbsp;Brüt Prim : &nbsp;</span>
                        </div>
                        <div class="proposalRightCell" style="width: auto; float: left;">
                            <span id="lblCascoProposal2GrossPremium"></span>
                        </div>
                    </div>
                </div>
                <div id="divCascoInstallmentPlanName" class="inputRow" style="margin-left: 16px">
                    <div style="width: 340px; height: 20px;">
                        <div class="proposalLeftCell" style="width: 130px;">
                            <span>&nbsp;Taksit Sayısı : &nbsp;</span>
                        </div>
                        <div class="proposalRightCell" style="width: auto; float: left;">
                            <span id="lblCascoInstallmentPlanName"></span>
                        </div>
                    </div>
                </div>
                <div class="inputRow" style="text-align: left; margin-top: 0; margin-left: 20px;">
                    <span id="lblCascoFinansbankDoctorsMsg" style="color: red; display: none; font-size: 10px; padding: 0; margin-bottom: 0; font-weight: bold">Sigortalının mesleği doktor ise, lütfen teklif düzeltme adımında 1024 Doctors Kasko Proje Kodunu seçiniz.</span>
                    <span id="lblCascoTerorTeminatiMsg" style="color: red; display: none; font-size: 10px; padding: 0; margin-bottom: 0; font-weight: bold">Bu teklifte terör teminatı verilememektedir</span>
                    <span id="lblBrandCascoMsg" style="color: red; display: none; font-size: 10px; padding: 0; margin-bottom: 0; font-weight: bold"></span>
                    <span id="lblCascoChosenServiceMsg" style="color: red; display: none; font-size: 10px; padding: 0; margin-bottom: 0; font-weight: bold"></span>
                    <span id="lblCascoKiymetKazanmaMsg" style="color: red; display: none; font-size: 10px; padding: 0; margin-bottom: 0; font-weight: bold">Bu teklifte Kıymet Kazanma Tenzili İstisnası verilmemiştir.</span>
                    <span id="lblSubUsageCodeWarning" style="color: red; display: none; font-size: 10px; padding: 0; margin-bottom: 0; font-weight: bold">Alt kullanım tarzı varsa hızlı teklif düzeltme adımından seçim yapınız. (Örnek: Hafriyat aracı, tanker vb.)</span>
                    <span id="lblFakePremiumMsg" style="padding: 0px; color: red; font-size: 14px; font-weight: bold; margin-bottom: 0px; margin-left: 30px; display: none;">Bu Teklif Sanal Prim İçermektedir</span>
                </div>
                <div class="inputRow" style="height: 30px;">

                    <div class="proposalButtonContainer btn-groupbtn" style="width: 100%">

                        <a href="javascript:;" id="btnCascoProposal2Edit" class="firstbtn">Görüntüle</a>
                        <a href="javascript:;" id="btnCascoProposal2EditNew">Düzenle</a>
                        <a href="javascript:;" class="lastbtn" id="btnCascoProposal2Print">Basım</a>
                    </div>
                    <div class="proposalButtonContainer btn-groupbtn" style="width: 100%">
                        <a href="javascript:;" class="firstbtn" id="btnCascoProposal2Confirm">Onayla</a>
                        <a href="javascript:;" class="lastbtn" style="width: 139px" id="btnCascoProposal2ChangeInstallmentPlan">Ödeme Yöntemi Değiştirme</a>
                    </div>
                    <div class="proposalButtonContainer btn-groupbtn" style="width: 100%">
                        <a href="javascript:;" class="firstbtn" id="btnSendSms" style="display: none">SMS Gönder</a>
                        <a href="javascript:;" class="firstbtn" id="btnSendSmsF36" style="display: none">SMS Gönder</a>
                    </div>
                    <div proposalbegindate="307" class="proposalButtonContainer" style="width: 100%; display: none">
                        <a href="javascript:;" id="btnPolicyStartDateUpdateForCasco" style="float: left; color: red; font-weight: bold; text-decoration: underline; margin-left: 53px;">Poliçe Başlangıç Tarihini Düzenle</a>
                    </div>
                    <div class="proposalButtonContainer" id="divCascoProposal2InstallmentInfoContainer" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; border-width: 1px;">
                        <p style="color: red; width: 94%; margin-top: 10px; margin-left: 10px; padding: 0; margin-bottom: 2px; font-size: 12px">
                            Peşin veya 3 taksite kadar seçilen ödemelerde uygulanan indirimli primleri görmek için <a style="font-weight: bold; text-decoration: underline;" onclick="OpenInstallmentPlan('btnCascoProposal2ChangeInstallmentPlan');">tıklayınız.</a>
                        </p>
                    </div>
                    <img id="btnFirsat" src="https://cdn.somposigorta.com.tr/cosmos/images/106OzelKomisyon.png" alt=" " border="0" style="padding-top: 30px; display: none;">
                </div>
            </div>
        </div>

        <div class="proposalSeparator" id="divChannelProfilSep" style="margin-top: 3%;">
        </div>
        <div class="proposalLeftContent" id="divCascoProposalScriptContainer" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; border-width: 1px; display: none">
            <!--<div class="proposalContentRow">
    			<div class="proposalHeader">
    				<span>Acente Profil Teklifi</span>
    			</div>
    		</div>
    					<div id="loadingDivCascoProposal2" class="loadingDiv">
    		</div>
    		<div id="loadedDivCascoProposal2Error" class="loadedDivCascoProposal2Error">
    			<span id="lblCascoProposal2Error"></span>
    		</div>
    		<div id="loadedDivCascoProposal2"  style="display: none">
    			<div class="proposalContentRow">
    				<div class="proposalLeftCell">
    				</div>
    				<div class="proposalRightCell">
    					<span id="lblCascoProposal2TransactionNo"></span>
    				</div>
    			</div>
    			<div class="proposalContentRow">
    				<div class="proposalLeftCell">
    				</div>
    				<div class="proposalRightCell">
    					<span id="lblCascoProposal2GrossPremium"></span>
    				</div>
    			</div>
    			<div class="proposalContentRow">
    				<div class="proposalButtonContainer">
    					<a href="#">
    						<img id="btnCascoProposal2Edit" src="/images/btn_View.png" alt=" " border="0" /></a>
    					<a href="#">
    						<img id="btnCascoProposal2Print" src="/images/btn_Print.png" alt=" " border="0" /></a>
    					<a href="#" id="btnCascoProposal2Confirma" class="btnEnabled">
    						<img id="btnCascoProposal2Confirm" src="/images/btn_Confirm.png" alt=" " border="0" /></a>
    				</div>
    			</div>
    		</div>-->
            <!--	<p style="width:94%; margin-top:0;margin-left:4px;padding:0">Kasko ürünümüzde bulunan muafiyetsiz cam kırılması teminatı seçimi, hızlı satış ekranlarımızda bulunan profil düzenleme adımından 19 Ocak 2015 Pazartesi günü itibarıyla kaldırılacak olup, mevcut profil tanımlamaları(sadece cam muafiyeti) tüm acentelerimiz için sıfırlanacaktır.Bu tarihten sonra hazırlanan tekliflerde hızlı satış ekranlarımızda yer alan hızlı teklif düzeltme adımını kullanarak cam muafiyeti teminatını ekleyebilirsiniz.</p>-->
            <p style="width: 94%; margin-top: 10px; margin-left: 10px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">Poliçeye Artı Teminat Ekleyin!</span><br>
                <!--Artı teminat ile müşterilerinize; <span class="auto-style1">sınırsız ikame araç</span> kullanımı, anahtarla çalınma durumunda <span class="auto-style1">muafiyetsiz ödeme</span>, lastik ve akü hasarlarında <span class="auto-style1">kıymet kazanma tenzili uygulanmaması</span> ve  ayrıcalıklı <span class="auto-style1">VIP hizmetler</span> sunabilirsiniz. Ayrıca, siz değerli acentemiz Artı Teminat priminin <span class="auto-style1">%25'i oranında ek komisyon</span> ve <span class="auto-style1">seyahat mili</span> kazanabilirsiniz! -->
                Poliçeye Artı Teminat Planı Ekleyerek Müşterinizin Ayrıcalıklı Hizmet ve Teminatlardan Faydalanmasını Sağlayın. Bu Satış ile %25 Komisyon Avantajı Kazanın.
            </p>
            <div style="width: 95%; text-align: right">
                <a href="#" id="btnAddExtraCover" style="float: left; color: red; font-weight: bold; text-decoration: underline; margin-left: 14px" onclick="OpenAddExtraCoverPopup();">Hemen Ekleyin</a>
                <!--***Önemli Not: LogInformationForScriptDetailClick('SDCASCO'); methodunda kullanılan parametre gösterilen dokümana özeldir methodu kullanırken farklı bir kısa kod kullanınız.-->
                <a href="http://cosmos.sompojapan.com.tr/Documents/Sompo_KaskoArtiTeminat_010725.pdf" onclick="LogInformationForScriptDetailClick2('307','307_460UrunKarti',$('#lblDangerousDiseasesProposalTransactionNo').text(),$('#lblCascoProposal2TransactionNo').text());" style="color: black; font-weight: bold; text-decoration: underline" target="_blank">Detaylar için tıklayınız!</a>
            </div>

        </div>

        <div class="proposalLeftContent" id="divCascoProposalCampaignScript" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; border-width: 1px; display: none; background-image: url(../../../images/star.png); background-repeat: no-repeat; background-position: 2px center;">
            <p id="pCascoProposalCampaignScript" style="width: 90%; margin-top: 10px; margin-left: 38px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span id="spanCascoProposalCampaignScript" style="color: red; font-weight: bold; font-size: 14px">Yıldızlı Teklif Fırsatı!</span>
                <br>
                <span id="spnCascoProposalCampaignScriptBody"></span>
            </p>

        </div>
        <div class="proposalLeftContent" id="divCascoProposalCampaignScript5" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; border-width: 1px; display: none; background-image: url(../../../images/star.png); background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 90%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">Ek komisyon kazanma fırsatı! </span>
                <br>
                Teklifi poliçeleştirmeniz halinde %3 ek komisyon kazanabilirsiniz.
            </p>

        </div>
        <div class="proposalLeftContent" id="divCascoProposalCampaignPoint1Script6" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; border-width: 1px; display: none; background-image: url(../../../images/star.png); background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 90%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">Müşterimize özel 250 Sompo Puan!</span>
                <br>
                Bu teklifi poliçeleştirmeniz halinde müşterimize özel 250 Sompo puanı tanımlanacaktır.
                Müşterimiz portal üzerinden Sompo Puanım uygulamasını aktif ederek 250 TL değerindeki Sompo Puanına ulaşabilir.
            </p>
        </div>
        <div class="proposalLeftContent" id="divCascoProposalCampaignPoint2Script6" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; border-width: 1px; display: none; background-image: url(../../../images/star.png); background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 90%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">Müşterimize özel 500 Sompo Puan!</span>
                <br>
                Bu teklifi poliçeleştirmeniz halinde müşterimize özel 500 Sompo puanı tanımlanacaktır.
                Müşterimiz portal üzerinden Sompo Puanım uygulamasını aktif ederek 500 TL değerindeki Sompo Puanına ulaşabilir.
            </p>
        </div>
        <div class="proposalLeftContent" id="divCascoProposalNewCampaignScript" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; border-width: 1px; display: none; background-image: url(../../../images/star.png); background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 90%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">FIRSAT TEKLİFİ! </span>
                <br>
                TEBRİKLER! Teklifi poliçeleştirmeniz durumunda
        <br>
                <b>ek komisyon fırsatı</b>ndan yararlanabilirsiniz.
            </p>
            <a href="http://cosmos.sompojapan.com.tr/Documents/kasko_kampanya_kurallari_311024_02.pdf" class="specialPackageRightButton color_black" target="_blank">Detaylar için tıklayınız</a>
        </div>
        <div class="proposalLeftContent" id="divCascoProposalCarWindowExemptionScript" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; border-width: 1px; display: none; /*background-image: url(../../../images/star.png); */ background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 90%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">Cam Muafiyeti! </span>
                <br>
                Teklifiniz cam muafiyetli oluşmuştur.
            </p>
        </div>
        <div class="proposalLeftContent" id="divCascoProposalCampaignScript7" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; background-image: url(../../../images/star.png); border-width: 1px; display: none; background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 80%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">Fırsatı Kaçırmayın!  </span>
                <br>
                Kasko teklifiniz hazır!
                <br>
                Kasko teklifinizi onaylayarak Trafik ve Kasko toplam priminizi <span id="spnCascoProposalCampaignScript7_1Price" style="color: red; font-weight: bold"></span>'den <span id="spnCascoProposalCampaignScript7_2Price" style="color: red; font-weight: bold"></span>'ye düşürebilirsiniz!
               <span id="spnCascoProposalCampaignScript7_3Price" style="color: red; font-weight: bold"></span>kazanma fırsatını kaçırmayın !
            </p>
        </div>
        <div class="proposalLeftContent" id="divCascoProposalWalletScript" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; border-width: 1px; display: none; background-repeat: no-repeat; background-position: 4px center;">
            <p style="margin-top: 10px; margin-left: 10px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: rgba(197, 17, 53, 1); font-weight: bold; font-size: 13px">Sompo Puan Kullan!</span><br>
                Müşterimizin cüzdanında var olan Sompo Puanları bu poliçede kullanabilirsiniz.<br>
                <span style="color: rgba(197, 17, 53, 1); font-size: 13px">Kullanılabilir Puan:</span><span style="color: rgba(197, 17, 53, 1); font-weight: bold; font-size: 13px" id="spnCascoProposalWalletPoint"></span>
            </p>
            <div style="width: 95%; text-align: left; font-size: 11px; margin-top: 10px; margin-left: 10px; margin-bottom: 10px;">
                (Poliçe tutarının %<span id="spnCascoProposalWalletUsagePercentage" style="font-weight: bold"></span>'sine kadar puan kullanılabilir.)
            </div>
            <div style="width: 95%; text-align: left; font-size: 11px; margin-top: 10px; margin-left: 10px; margin-bottom: 10px;">
                <u>Puanları kullanmak için onay ekranına devam edin.</u>
            </div>
        </div>
    </div>

#### Burası boşsa buradan da çekebilirsin

<div class="proposalContainer">

        <div class="proposalLeftContent">
            <div class="proposalContentRowTrafficAlter">
                <div class="proposalHeader">
                    <span>Trafik Teklifi</span>
                </div>
            </div>
            <div id="loadingDivTrafficProposalAlternative" class="loadingDivTrafficProposal" style="display: none;">
            </div>
            <div id="loadedDivTrafficProposalErrorAlternative" class="loadedDivTrafficError" style="display: none;">
                <span id="lblTrafficProposalErrorAlternative"></span>
            </div>
            <div id="loadedDivTrafficProposalAlternative" style="">
                <div style="margin-left: 32px">
                    <div class="proposalContentRowTrafficAlter" style="margin-top: 1px; float: left;">
                        <div class="proposalLeftCell" style="width: 130px;">
                            <span id="lblTrafficProposalStartEndDateOrProposalNoTitleAlternative">Teklif No:</span>&nbsp;
                        </div>
                        <div class="proposalRightCell" style="width: auto; float: left;">
                            <span id="lblTrafficProposalStartEndDateOrProposalNoAlternative">311000502365998</span>
                        </div>
                    </div>
                    <div class="proposalContentRowTrafficAlter" style="margin-top: 1px; float: left;">
                        <div class="proposalLeftCell" style="width: 130px;">
                            <span id="lblTrafficProposalGrossPremiumTitleAlternative">Brüt Prim :</span>&nbsp;
                        </div>
                        <div class="proposalRightCell" style="width: auto; float: left;">
                            <span id="lblTrafficProposalGrossPremiumAlternative" style="color: black;">18.165,99 TL</span>
                        </div>
                    </div>
                    <div class="proposalContentRowTrafficAlter" style="margin-top: 1px; float: left;">
                        <div class="proposalLeftCell" style="width: 130px;">
                            <span>Komisyon Tutarı - Oranı: &nbsp;</span>
                        </div>
                        <div class="proposalRightCell" style="width: auto; float: left;">
                            <span id="lblTrafficProposalCommisionAmountAlternative">1665.71 TL</span>-   <span id="lblTrafficProposalCommisionRatioAlternative">%10</span>
                        </div>
                    </div>
                </div>
                <div class="proposalContentRowTrafficAlter">

                    <div class="proposalButtonContainer btn-groupbtn" style="width: 100%">
                        <a href="javascript:;" id="btnTrafficProposalViewAlternative" class="firstbtn">Görüntüle</a>

                        <a href="javascript:;" id="btnTrafficProposalPrintAlternative">Basım</a>
                        <a href="javascript:;" class="lastbtn" id="btnTrafficProposalConfirmAlternative">Onayla</a>
                        <div class="proposalButtonContainer btn-groupbtn" style="width: 100%">
                            <a href="javascript:;" class="firstbtn" id="btnTrafficProposalSendSmsAlternative" style="display: none;">SMS Gönder</a>
                            <a href="javascript:;" class="firstbtn" id="btnTrafficProposalSendSmsAlternativeF36" style="display: none;">SMS Gönder</a>
                        </div>
                    </div>
                </div>
                <span style="color: rgb(255, 0, 0); display: none;" id="lblTrafficAlterEagentMsgAlternative">İşleminize bu ekrandan devam edilememektedir</span>
            </div>
        </div>
        <div class="proposalSeparator">
        </div>

        <div class="proposalLeftContent" id="divTrafficProposalCampaignScript1" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; background-image: url(../../../images/star.png); border-width: 1px; display: none; background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 80%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">Fırsatı Kaçırmayın!  </span>
                <br>
                Kasko teklifinizi onaylamanız durumunda Kasko ile birlikte Trafik poliçenizde toplamda <span style="font-weight: bold; color: red;"><span id="spnTrafficProposalCampaignScript1Price" style="color: red;"></span>&nbsp;indirim</span> kazanabilirsiniz. Bu fırsatı kaçırmayın
            </p>
            <div class="proposalButtonContainer btn-groupbtn" style="width: 100%; margin-left: 120px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <a href="javascript:;" id="btnDoCascoProposal" class="firstbtn lastbtn">Teklif Oluştur</a>
            </div>
        </div>
        <div class="proposalLeftContent" id="divTrafficTssProposalCampaignScript" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; background-image: url(../../../images/star.png); border-width: 1px; display: none; background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 80%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">Fırsatı Kaçırmayın!  </span>
                <br>
                Tamamlayıcı Sağlık teklifinizi onaylamanız durumunda Tamamlayıcı Sağlık ile birlikte Trafik poliçenizde <span style="font-weight: bold; color: red;"><span id="spnTrafficTssProposalCampaignScript2Price" style="color: red;"></span>&nbsp;indirim</span> kazanabilirsiniz. Bu fırsatı kaçırmayın!
            </p>
        </div>
        <div class="proposalLeftContent" id="divTrafficProposalCampaignScript2" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; background-image: url(../../../images/star.png); border-width: 1px; display: none; background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 80%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                <span style="color: red; font-weight: bold; font-size: 14px">Fırsatı Kaçırmayın!  </span>
                <br>
                Kasko teklifinizi onaylamanız durumunda Kasko ile birlikte Trafik poliçenizde toplamda <span style="font-weight: bold; color: red;"><span id="spnTrafficProposalCampaignScript2Price" style="color: red;"></span>&nbsp;indirim</span> kazanabilirsiniz. Bu fırsatı kaçırmayın.
            </p>
        </div>
        <div class="proposalLeftContent" id="divTrafficProposalCampaignScript3" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; background-image: url(../../../images/star.png); border-width: 1px; display: none; background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 80%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">

                <span id="spnTrafficProposalCampaignScript3Text"><span style="font-weight: bold;">%25’e varan indirimli teklifiniz</span> hazırlanmıştır.</span>
                <br>
                Bu fırsatı <span style="font-weight: bold;">kaçırmayın!</span>
            </p>
        </div>
        <div class="proposalLeftContent" id="divTrafficProposalCampaignScript4" style="text-align: left; background-color: #DCE6F2; border-radius: 20px; border-color: #6F95C3; border-style: solid; background-image: url(../../../images/star.png); border-width: 1px; display: none; background-repeat: no-repeat; background-position: 4px center;">
            <p style="width: 80%; margin-top: 10px; margin-left: 45px; padding: 0; margin-bottom: 2px; font-size: 12px">
                Kasko ile birlikte Trafik poliçenizde toplamda <span id="spnTrafficProposalCampaignScript4_1Price" style="font-weight: bold; color: red;"></span>indirim uygulanmıştır. trafik ve kasko toplam priminizi <span id="spnTrafficProposalCampaignScript4_2Price" style="font-weight: bold; color: red;"></span>'den <span id="spnTrafficProposalCampaignScript4_3Price" style="font-weight: bold; color: red;"></span>'ye düşmüştür
            </p>
        </div>


    </div>
