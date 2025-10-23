url = https://cosmos.sompojapan.com.tr/?guid=a981427e-83af-425c-bc28-ae8e74f24c98&startupScript=52614B506A16E1209E52C33A2D21DEF5B761124842915AB2C7A856FF04781C07964708F4F864802E7C2C45060EBE983DFC99EBF3861094F0785961AD9170E8473812BCFE3B21EE1A1DA30065819F6D42903D992B8847BADA2AC6C78D6653CCD6F2FC7E435E5B7C517832CE42AB54EC8B1C49448E8E009ED8FC3ABC1DE3B5FDA2CAD419282A53AD595AB826AD059CD0B28FD1D356AE45C5642E4F26A425391DBEB9EC86A7248101AFDB008DF6F91C739EF63931CEF68BA05290C54B7E19E5B82AEE92540763D60FA0DF95098982253DEDDC7D452A47641FEE65CE86FAD237BE2E19FACC8FBFB2D2C4631B1530AD33292EF0C34C1BC0760649F5ABC8A068494E3A3C3227F1813D67F28C40A462121F651E21AE46B22A46CBECF24A82761AA7F61E78B2D841E18E089DD5E9B41907C2DF68F027855B6FA87CB5B894D1074578B549C58ECDF48203D9E521711038AD29AB7A0C89EFAE5673C433B9FE8D2FDCFF7642C0BF8624FA8C41DA85018D236D83CCC4F3740C8C78699EC365619610D06B505179AAD3AACA652477D1E2228CB3167B31D47840AD021C288516CA746EAD6B5E8832EAB25B8B8696D8AE13A881AA5B74B9AC8FA622ACEDA2153FBEC86DCE9AC2B07FE999521C08D467556434CAE3C26339155953B841FA2E8CBDD1662860CD8C0CC952A704E56CDE5A8678CE723A3F7826C3116778E928D3D0463A6D50AD009A82025096684DE5B526068970F4F42CE1C535055FF25310409F0982D84599E16C598715654E747BCEBD1C8974398AE9873E5C0745FE07FD8E42301F61944074CE843A691B4C633E0E076517928A3CBDE2BA78B52754177D7514B7B8CE9BF20BDD618B8A6E25A7779732B0E6C72FC100793D8AAAB6AABCE663CA31870AB678769E8061B7428890D52C5E3874165E4D2E081A

tc input = <input id="txtIdentityOrTaxNo" type="text" maxlength="11" tabindex="1" style="width: 96px">

araç plakası input = <input id="txtPlateNoCityNo" type="text" maxlength="3" tabindex="2" style="width: 25px; float: left">
<input id="txtPlateNo" type="text" tabindex="3" style="width: 105px; float: left; margin-left: 2px">

kasko ürün select = <select id="ddlCascoProduct" style="width: 90%; font-size: 11px" tabindex="8">

<option value="-1">Seçiniz</option>
<option value="307">Bireysel Kasko </option>
<option value="333">Ticari Kasko </option>

                    </select>

sigortalının aktif mesleği input = <input id="txtCascoJobCode" type="text" tabindex="8" style="width: 88.5%; font-size: 11px; height: 15px; float: left" disabled="" class="ui-autocomplete-input" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true">

checkboxlar = <input id="chkCasco" type="checkbox" checked="checked">
<input id="chkTraffic" type="checkbox" checked="checked">

Sigortalı tipi = <label for="rblCustomerType_0">Bireysel<label class="clsEnglishInfo" style="display: block;">Individual</label></label>

Sigortalı adresi = <textarea id="txtCustAddress" style="width: 190px; height: auto; min-height: 40px; overflow: visible" readonly="readonly" rows="4" cols="4"></textarea>

Sigortalı iletişim = <div class="rightCell" style="width: 130px;">
<input id="rblInsuredContactType_0" type="radio" name="rblInsuredContactType" value="G" checked="checked"><label for="rblInsuredContactType_0">Cep Tel.</label>
<input id="rblInsuredContactType_1" type="radio" name="rblInsuredContactType" value="E"><label for="rblInsuredContactType_1">E-Mail</label>

</div>

Sigortalı - eğer cep seçilirse - cep = <div class="rightCell" style="width: 126px;">

                <input type="text" name="txtInsuredGsmAreaCode" id="txtInsuredGsmAreaCode" class="inputs text" style="width: 35px;" maxlength="3">
                <input type="text" name="txtInsuredGsmNumber" id="txtInsuredGsmNumber" class="inputs text" style="width: 65px;" maxlength="7">
            </div>

teklif oluştur = <a id="btnProposalCreate" tabindex="13" style="cursor: pointer;">Teklif Oluştur</a>

eğer tel girilirse doğum tarihi alanı açılıyor = <span class="maskBirthDate">**/**/2\*\*0</span>

o zaman adres oto geliyor

Araç bilgileri girilince buna basılmalı = <img id="btnSearchEgm" alt="EGM Sorgula" src="https://cdn.somposigorta.com.tr/cosmos/images/btn_SearchProvince_d.gif" style="border: none; margin-left: 2px; cursor: default;" tabindex="7" disabled="disabled">

sonra teklif oluştura basılmalı

Olası teklif formu çıktı alanı =

<div class="proposalContainer">
        <div class="proposalLeftContent">
            <div class="proposalContentRow">
                <div class="proposalHeader">
                    <span>Trafik Teklifi</span>
                </div>
            </div>
            <div id="loadingDivTrafficProposal" class="loadingDivTrafficProposal">
            </div>
            <div id="loadedDivTrafficProposalError" class="loadedDivTrafficError">
                <span id="lblTrafficProposalError"></span>
            </div>
            <div id="loadedDivTrafficProposal" style="display: none">
                <div style="margin-left: 32px">
                    <div class="proposalContentRow" style="margin-top: 1px; float: left;">
                        <div class="proposalLeftCell" style="width: 130px;">
                            <span id="lblTrafficProposalStartEndDateOrProposalNoTitle">Teklif No&nbsp; :&nbsp;</span>
                        </div>
                        <div class="proposalRightCell" style="width: auto; float: left;">
                            <span id="lblTrafficProposalStartEndDateOrProposalNo"></span>&nbsp;&nbsp;
                        </div>
                    </div>
                    <div class="proposalContentRow" style="margin-top: 1px; float: left;">
                        <div class="proposalLeftCell" style="width: 130px;">
                            <span id="lblTrafficProposalGrossPremiumTitle">&nbsp;Brüt Prim : &nbsp;</span>
                        </div>
                        <div class="proposalRightCell" style="width: auto; float: left;">
                            <span id="lblTrafficProposalGrossPremium"></span>
                        </div>
                    </div>
                    <div class="proposalContentRow" style="margin-top: 1px; float: left;">
                        <div class="proposalLeftCell" style="width: 130px;">
                            <span>&nbsp;Komisyon Tutarı - Oranı: &nbsp;</span>
                        </div>
                        <div class="proposalRightCell" style="width: auto; float: left;">
                            <span id="lblTrafficProposalComissionAmount"></span>-   <span id="lblTrafficProposalComissionRatio"></span>
                        </div>
                    </div>
                </div>
                <div class="proposalContentRow">
                    <div class="proposalButtonContainer btn-groupbtn" style="width: 100%">


                        <a href="javascript:;" id="btnTrafficProposalView" class="firstbtn">Görüntüle</a>
                        <a href="javascript:;" id="btnTrafficProposalViewNew">Düzenle</a>
                        <a href="javascript:;" id="btnTrafficProposalPrint">Basım</a>
                        <a href="javascript:;" class="lastbtn" id="btnTrafficProposalConfirm">Onayla</a>

                        <div class="proposalButtonContainer btn-groupbtn" style="width: 100%; margin-left: -15px;">
                            <a href="javascript:;" class="firstbtn" id="btnTrafficSendSms" style="display: none;">SMS Gönder</a>
                            <a href="javascript:;" class="firstbtn" id="btnTrafficSendSmsF36" style="display: none;">SMS Gönder</a>
                        </div>


                        <input type="image" name="ucTrafficAndVehicleTab1$btnCreateTrafficPolicy" id="ucTrafficAndVehicleTab1_btnCreateTrafficPolicy" src="https://cdn.somposigorta.com.tr/cosmos/images/btn_CreateTrafficPolicy.png" alt="Oluştur" onclick="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ucTrafficAndVehicleTab1$btnCreateTrafficPolicy&quot;, &quot;&quot;, false, &quot;&quot;, &quot;https://www.sompojapan.com.tr/WebTrafikv2/default.asp&quot;, false, false))" style="border-style: none; display: none;">
                    </div>

                    <div proposalbegindate="311" class="proposalButtonContainer" style="width: 100%; display: none">
                        <a href="javascript:;" id="btnPolicyStartDateUpdateForTraffic" style="float: left; color: red; font-weight: bold; text-decoration: underline; margin-left: 53px;">Poliçe Başlangıç Tarihini Düzenle</a>
                    </div>


                </div>
                <span style="color: rgb(255, 0, 0); display: none;" id="lblTrafficEagentMsg">İşleminize bu ekrandan devam edilememektedir.</span>
            </div>
        </div>
        <div class="proposalSeparator">
        </div>

    </div>
