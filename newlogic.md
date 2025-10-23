### iş teklifi input = <button data-v-84f46f20="" class="p-button p-component p-button-fluid" type="button" data-pc-name="button" data-p-disabled="false" pc337="" data-pc-section="root"><span data-v-84f46f20="" class="d-flex justify-content-center align-items-center text-primary rounded-pill bg-white bi bi-magic" style="width: 2rem; height: 2rem;"></span>YENİ İŞ TEKLİFİ<span data-v-84f46f20="" class="bi bi-arrow-right-short fs-5 pe-2 ms-auto"></span></button>

### iş teklifi butonundan sonra trafik = <div class="job__name">Trafik</div>

### altında iş teklifi al butonu = <button class="p-button p-component p-button-outlined p-button-sm" type="button" aria-label="TEKLİF AL" data-pc-name="button" data-p-disabled="false" pc712="" data-pc-section="root"><!----><span class="p-button-label" data-pc-section="label">TEKLİF AL</span><!----></button>

### açılan url de yazdığımız bilgiler ilgili alanlara girilecek formu buna göre düzenle

### trafik checkboxu seçilecek = <input id="chkTraffic" type="checkbox">

### kasko checkboxu kaldırılacak = <input id="chkCasco" type="checkbox" checked="checked">

EGM bilgileri formu sitemizden uygun bilgiler ile doldurulacak buradan al = <div class="inputLeftContent" id="divCascoPlateAndEgmControls">

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

### Sonra tc kimlik girilecek = <input id="txtIdentityOrTaxNo" type="text" maxlength="11" tabindex="1" style="width: 96px">

### buna tıklanılacak ve adres bilgisi otomatik doldurulacak =<textarea id="txtCustAddress" style="width: 190px; height: auto; min-height: 40px; overflow: visible" readonly="readonly" rows="4" cols="4"></textarea>

### son adımda teklif al butonuna tıklanılacak = <a id="btnProposalCreate" tabindex="13" style="cursor: pointer;">Teklif Oluştur</a>

### bilgileri buradan çek = <div class="proposalContainer">

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

#### Burası boşsa buradan da çekebilirsin = <div class="proposalContainer">

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
